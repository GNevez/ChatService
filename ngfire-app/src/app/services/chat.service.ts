import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private selectedChat = new BehaviorSubject<string>('');
  private privateRoom = new BehaviorSubject<any>(null); // BehaviorSubject para armazenar o documento

  selectedChat$ = this.selectedChat.asObservable();
  privateRoom$ = this.privateRoom.asObservable(); // Observable para os componentes assinarem

  constructor(private firestore: Firestore) {
    this.selectedChat$.subscribe((id) => {
      if (id) {
        this.fetchPrivateRoomById();
      }
    });
  }

  setSelectedChat(id: string) {
    this.selectedChat.next(id);
  }

  // Método para buscar o documento pelo ID
  async fetchPrivateRoomById() {
    const selectedChatId = this.selectedChat.value;

    if (!selectedChatId) {
      console.error('Nenhum chat selecionado');
      return;
    }
    console.log(selectedChatId);

    try {
      // 1. Referência ao documento pelo ID
      const privateRoomRef = doc(
        this.firestore,
        'private_rooms',
        selectedChatId
      );

      // 2. Busca o documento
      const docSnapshot = await getDoc(privateRoomRef);

      if (docSnapshot.exists()) {
        const roomData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };
        this.privateRoom.next(roomData); // Atualiza o BehaviorSubject com os dados do documento
      } else {
        console.error('Documento não encontrado');
        this.privateRoom.next(null); // Limpa o BehaviorSubject se o documento não existir
      }
    } catch (error) {
      console.error('Erro ao buscar private room:', error);
      this.privateRoom.next(null); // Em caso de erro, limpa os dados
    }
  }
}
