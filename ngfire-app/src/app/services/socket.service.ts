import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { env } from '../../env/environments';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { dataMessages } from '../interfaces/dataMessages';
import { User } from '../interfaces/userInterface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor(private http: HttpClient, private auth: AuthService) {
    // Inicializa a conexão com o servidor
    this.socket = io(env.backServer);
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  // Mapeia o usuário, enviando os dados para o backend
  mapUser(user: User) {
    this.socket.emit('user_connected', user);
  }

  getMessages() {
    return this.http.get<string[]>(env.backServer + '/mensagens');
  }

  // Envia mensagem pública para o servidor
  sendMessage(message: dataMessages): void {
    console.log(message);
    console.log(this.socket);
    this.socket.emit('mensagem', message);
  }

  // Escuta mensagens públicas
  listenForMessages() {
    return new Observable<string>((observer) => {
      this.socket.on('mensagem', (message) => {
        observer.next(message);
      });
    });
  }

  // Inicia a conversa privada com outro usuário (enviando o socket id dele)
  startMessage(id: string) {
    this.auth.getUser().subscribe((user) => {
      if (user) {
        this.socket.emit('startMessage', {
          id,
          uid: user.uid,
          email: user.email,
        });
      } else {
        console.warn('Usuário não autenticado!');
      }
    });
  }

  listenForStartMessage() {
    return new Observable<any>((observer) => {
      this.socket.on('room_started', (chatId) => {
        observer.next(chatId);
      });
    });
  }

  // Método para solicitar que o cliente entre em uma sala (room)
  joinRoom(roomName: string): void {
    this.socket.emit('join_room', roomName);
  }

  // Envia mensagem privada para um usuário, informando o destinatário,
  // o conteúdo da mensagem e o roomId (identificador da conversa)
  sendPrivateMessage(data: dataMessages): void {
    console.log('teste');

    this.socket.emit('private_message', data);
  }

  // Escuta as mensagens privadas que são enviadas para a sala
  listenForPrivateMessages() {
    return new Observable<any>((observer) => {
      this.socket.on('private_message', (message) => {
        observer.next(message);
        console.log(message);
      });
    });
  }
}
