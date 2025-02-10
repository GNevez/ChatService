import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { MessagesService } from '../../services/messages.service';
import { AuthService, UserData } from '../../services/auth.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { SocketService } from '../../services/socket.service';

interface Message {
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-main-chat',
  standalone: false,
  templateUrl: './main-chat.component.html',
  styleUrls: [
    './main-chat.component.scss',
    '../../pages/home/home.component.scss',
  ],
})
export class MainChatComponent implements OnInit, OnDestroy {
  valorAlterado: string = '';
  chatId: string = '';
  userData$!: Observable<UserData | null>;
  user: UserData | null = null;

  private messagesSubject = new BehaviorSubject<any[]>([]); // Armazena as mensagens
  public messages$ = this.messagesSubject.asObservable();

  private destroy$ = new Subject<void>(); // Para gerenciar unsubscribe

  constructor(
    private chatService: ChatService,
    private messagesService: MessagesService,
    private auth: AuthService,
    private authB: Auth,
    private socket: SocketService
  ) {}

  ngOnInit() {
    // Subscrição do usuário
    this.userData$ = authState(this.authB).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        return this.auth.getUser();
      })
    );

    this.userData$.subscribe((user) => {
      this.user = user;
    });

    // Subscrição do chat selecionado
    this.chatService.selectedChat$
      .pipe(takeUntil(this.destroy$))
      .subscribe((novoValor: string) => {
        this.valorAlterado = novoValor;
      });

    // Subscrição das mensagens
    this.chatService.privateRoom$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rooms) => {
        this.chatId = rooms.roomId;
        if (this.chatId?.trim()) {
          this.messages$ = this.messagesService.loadMessages(this.chatId);
          this.messages$.subscribe((value) => {
            console.log(value);
          });
        } else {
          this.messagesService.clearMessages(); // Limpa as mensagens se não houver chatId
        }
      });

    this.socket.listenForPrivateMessages().subscribe((data) => {
      console.log("callback do socket " + data);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(); // Cancela todas as subscrições
    this.destroy$.complete();
  }
}
