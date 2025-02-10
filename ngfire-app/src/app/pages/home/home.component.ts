import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { AuthService, UserData } from '../../services/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { SocketService } from '../../services/socket.service';
import { ModalService } from '../../services/modal.service';
import { dataMessages } from '../../interfaces/dataMessages';
import { ContactsService } from '../../services/contacts.service';
import { ChatService } from '../../services/chat.service';

import { HeaderChatComponent } from '../../components/header-chat/header-chat.component';
import { MainChatComponent } from '../../components/main-chat/main-chat.component';
import { MessageInputComponent } from '../../components/message-input/message-input.component';

interface Conversation {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  isStarred: boolean;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userData$!: Observable<UserData | null>;
  conversations: any = [];
  selectedChat: string | null = null;

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private socketService: SocketService,
    private modalService: ModalService,
    private contactsService: ContactsService,
    private chatService: ChatService
  ) {
    this.socketService.listenForMessages().subscribe((message) => {
      this.messages.push(message);
    });
  }

  async ngOnInit() {
    this.userData$ = authState(this.auth).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        return this.authService.getUser();
      })
    );
    console.log(this.userData$);

    this.userData$ = authState(this.auth).pipe(
      switchMap((user) => (user ? this.authService.getUser() : of(null)))
    );

    const userData: any = await firstValueFrom(this.userData$);
    if (userData) {
      console.log(userData);

      this.socketService.mapUser(userData);
    }

    this.socketService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });

    this.socketService.listenForPrivateMessages().subscribe(async (data) => {
      const verificacao = this.conversations.some(
        (item: { roomId: string }) => item.roomId === data.roomId
      );
      if (!verificacao) {
        this.conversations.push(...await this.contactsService.getConversationsByRoomId(data.roomId));
      }

      console.log(this.conversations);
    });

    this.socketService.listenForStartMessage().subscribe((data) => {
      console.log('created room ' + data);
      this.loadConversations();
      this.modalService.closeModal();
    });

    this.loadConversations();
  }

  async loadConversations() {
    try {
      this.conversations = await this.contactsService.getUserConversations();
      console.log('Conversas carregadas:', this.conversations);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  }

  statusColors: { [key: string]: string } = {
    online: 'bg-success',
    offline: 'bg-terceira',
    away: 'bg-warning',
  };

  setSelectedChat(id: string) {
    this.chatService.setSelectedChat(id);
    this.selectedChat = id;
  }

  message: string = '';
  messages: string[] = [];

  openModal() {
    this.modalService.openModal();
  }
}
