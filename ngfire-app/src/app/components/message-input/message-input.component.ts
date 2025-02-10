import { Component, OnInit } from '@angular/core';
import { dataMessages } from '../../interfaces/dataMessages';
import { SocketService } from '../../services/socket.service';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-input',
  standalone: false,
  templateUrl: './message-input.component.html',
  styleUrls: [
    './message-input.component.scss',
    '../../pages/home/home.component.scss',
  ],
})
export class MessageInputComponent implements OnInit {
  message: string = '';
  valorAlterado: string = '';
  chatId: string = '';
  sender: string = '';
  recipient: string = '';

  private subscription: Subscription | null = null;

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
  ) {}

  async ngOnInit() {
    this.subscription = this.chatService.selectedChat$.subscribe(
      (novoValor: string) => {
        this.valorAlterado = novoValor;
      }
    );

    this.chatService.privateRoom$.subscribe((rooms) => {
      this.chatId = rooms.roomId;
      this.sender = rooms.user1;
      this.recipient = rooms.user2;
    });
  }

  sendMessage() {
    console.log(this.message);

    const data: dataMessages = {
      message: this.message,
      sender: this.sender,
      recipient: this.recipient,
      roomId: this.chatId,
      timestamp: Date(),
    };

    console.log(data);

    this.socketService.sendPrivateMessage(data);
    this.message = '';
  }
}
