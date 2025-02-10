import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-chat',
  standalone: false,
  templateUrl: './header-chat.component.html',
  styleUrls: [
    './header-chat.component.scss',
    '../../pages/home/home.component.scss',
  ],
})
export class HeaderChatComponent implements OnInit, OnDestroy {
  valorAlterado: string = '';
  privateRooms: any[] = [];
  chatRecipient: string = "";
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Inscrição para mudança de chat selecionado
    this.subscriptions.push(
      this.chatService.selectedChat$.subscribe((novoValor: string) => {
        this.valorAlterado = novoValor;
      })
    );

    // Inscrição para salas privadas
    this.subscriptions.push(
      this.chatService.privateRoom$.subscribe((rooms) => {
        if (rooms) { // ✅ Evita erro de acesso se rooms for null/undefined
          this.privateRooms = rooms;
          this.chatRecipient = rooms.user2 || ''; // Evita erro caso user2 não exista
          console.log(this.privateRooms);
        }
      })
    );

    // Opcional: Só chama se os dados não estiverem sendo carregados corretamente
    if (this.privateRooms.length === 0) {
      this.chatService.fetchPrivateRoomById();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
