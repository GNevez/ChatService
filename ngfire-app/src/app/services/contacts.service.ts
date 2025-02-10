import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  async getUserConversations() {
    try {
      // Aguarda o usuário ser carregado corretamente
      const user = await firstValueFrom(this.auth.getUser());

      if (!user) {
        console.warn('Usuário não autenticado!');
        return [];
      }

      const uid = user.uid;
      console.log('UID do usuário autenticado:', uid);

      const roomsRef = collection(this.firestore, 'private_rooms'); // Referência à coleção
      const q = query(roomsRef, where('ownUID', '==', uid)); // Ajuste para usar 'ownUID'

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn('Nenhuma conversa encontrada para esse usuário.');
      }

      const conversations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Conversas encontradas:', conversations);
      return conversations;
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  }

  async getConversationsByRoomId(roomId: string){
    try {
      const user = await firstValueFrom(this.auth.getUser());

      if (!user) {
        console.warn('Usuário não autenticado!');
        return [];
      }

      const roomsRef = collection(this.firestore, 'private_rooms');
      const q = query(roomsRef, where('roomId', '==', roomId)); 

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn('Nenhuma conversa encontrada para esse usuário.');
      }

      const conversations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Conversas encontradas:', conversations);
      return conversations;
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  }
}
