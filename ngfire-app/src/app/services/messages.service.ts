import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { map, take, tap } from 'rxjs/operators';
import { SocketService } from './socket.service'; // Importe o SocketService

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messagesSubject = new BehaviorSubject<any[]>([]); // Armazena as mensagens
  public messages$ = this.messagesSubject.asObservable(); // Observable para o componente

  constructor(
    private firestore: Firestore,
    private socketService: SocketService // Injete o SocketService
  ) {
    this.listenToSocket(); // Inicia a escuta do socket
  }

  // Escuta as mensagens recebidas via socket
  private listenToSocket(): void {
    this.socketService.listenForPrivateMessages().subscribe((message: any) => {
      console.log('Nova mensagem recebida via socket:', message);
      const currentMessages = this.messagesSubject.value; // Pega o array atual de mensagens
      const updatedMessages = [...currentMessages, message]; // Adiciona a nova mensagem
      this.messagesSubject.next(updatedMessages); // Atualiza o BehaviorSubject
    });
  }

  // Carrega as mensagens do Firestore e inicia a escuta do socket
  loadMessages(chatId: string): BehaviorSubject<any[]>{
    if (!chatId) {
      this.messagesSubject.next([]); // Limpa as mensagens se não houver chatId
    }

    // Busca as mensagens do Firestore
    const messagesRef = collection(this.firestore, 'private_messages');
    const q = query(
      messagesRef,
      where('roomId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    collectionData(q, { idField: 'id' })
      .pipe(
        take(1), // Garante que a busca no Firestore seja feita apenas uma vez
        tap((messages) => {
          this.messagesSubject.next(messages); // Atualiza o BehaviorSubject com as mensagens do Firestore
        })
      )
      .subscribe();
      return this.messagesSubject;

  }

  // Limpa as mensagens (útil ao trocar de chat)
  clearMessages(): void {
    this.messagesSubject.next([]);
  }
}