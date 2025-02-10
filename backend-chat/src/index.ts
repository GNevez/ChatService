import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./firebase-config";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let mensagens: string[] = [];
let onlineUsers: string[] = [];

const userRooms: { [uid: string]: Set<string> } = {};

app.get("/mensagens", (req, res) => {
  res.json(mensagens);
});

app.get("/contacts", (req, res) => {});

const users: any = {};

function generateRoomId(uid1: string, uid2: string) {
  return [uid1, uid2].sort().join("_");
}

io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on("user_connected", (user) => {
    socket.data.username = user.nome;
    socket.data.email = user.email;
    socket.data.uid = user.uid;
    users[user.nome] = socket.id;
    console.log("User connected:", user);

    if (userRooms[socket.data.uid]) {
      for (const roomId of userRooms[socket.data.uid]) {
        socket.join(roomId);
        socket.emit("room_joined", roomId);
        console.log(`Reentrando na sala ${roomId} para ${socket.data.username}`);
      }
    }

    io.emit("update_users", Object.keys(users));
  });

  socket.on("mensagem", async (data) => {
    const { message, sender, recipient, timestamp } = data;
    try {
      await db.collection("messages").add({
        message,
        sender,
        recipient,
        timestamp,
      });
      console.log("Mensagem salva no Firestore:", data);
      io.to(recipient).emit("mensagem", data);
    } catch (error) {
      console.error("Erro ao salvar a mensagem no Firestore:", error);
    }
  });

  socket.on("private_message", (data) => {
    const messageData = {
      roomId: data.roomId,
      timestamp: new Date(),
      sender: socket.data.username,
      recipient: data.recipient,
      content: data.message,
    };

    console.log(messageData);

    db.collection("private_messages")
      .add(messageData)
      .then(() => console.log("Mensagem privada salva:", messageData))
      .catch((error) =>
        console.error("Erro ao salvar mensagem privada:", error)
      );
    console.log("private message " + data.roomId);

    io.to(data.roomId).emit("private_message", messageData);
  });

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.emit("room_joined", roomName);
  });

  socket.on("startMessage", async (data) => {
    const targetSocket = io.sockets.sockets.get(data.id);
    if (!targetSocket) return;

    const roomId = generateRoomId(socket.data.uid, targetSocket.data.uid);
    console.log(`Criando sala para ${socket.data.uid} e ${targetSocket.data.uid}: ${roomId}`);

    socket.join(roomId);
    targetSocket.join(roomId);

    if (!userRooms[socket.data.uid]) {
      userRooms[socket.data.uid] = new Set();
    }
    userRooms[socket.data.uid].add(roomId);

    if (!userRooms[targetSocket.data.uid]) {
      userRooms[targetSocket.data.uid] = new Set();
    }
    userRooms[targetSocket.data.uid].add(roomId);

    const userEmail = data.email;
    const targetEmail = targetSocket.data.email;

    try {
      const querySnapshot = await db
        .collection("private_rooms")
        .where("email1", "in", [userEmail, targetEmail])
        .where("email2", "in", [userEmail, targetEmail])
        .get();

      if (!querySnapshot.empty) {
        console.log("Já existe uma conversa entre esses usuários.");
        return; 
      }

      await db.collection("private_rooms").add({
        roomId: roomId,
        socket1: socket.id,
        socket2: targetSocket.id,
        user1: socket.data.username,
        user2: targetSocket.data.username,
        ownUID: data.uid,
        email1: userEmail,
        email2: targetEmail,
        createdAt: new Date(),
      });

      io.to(roomId).emit("room_started", roomId);
    } catch (error) {
      console.error("Erro ao verificar ou criar a sala:", error);
    }
  });

  socket.on("disconnect", () => {
    if (socket.data.username) {
      delete users[socket.data.username];
      io.emit("update_users", Object.keys(users));
    }
    console.log(`Socket desconectado: ${socket.id}`);
  });

  onlineUsers.push(socket.id);
});

app.get("/onlineUsers", (req, res) => {
  res.status(200).send(users);
});

app.get("/private_messages/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const messagesSnapshot = await db
      .collection("private_messages")
      .where("roomId", "==", roomId)
      .orderBy("timestamp")
      .get();
    const messages = messagesSnapshot.docs.map((doc) => doc.data());
    res.json(messages);
  } catch (error) {
    console.error("Erro ao recuperar mensagens:", error);
    res.status(500).send("Erro ao recuperar mensagens");
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
