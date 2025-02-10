import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-modal-users',
  templateUrl: './modal-users.component.html',
  imports: [CommonModule],
  styleUrls: ['./modal-users.component.scss'],
})
export class ModalUsersComponent implements OnInit, OnDestroy {
  visible = false;
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: ModalService,
    private socketService: SocketService
  ) {}

  closeModal() {
    this.modalService.closeModal();
  }

  ngOnInit() {
    // Subscreva-se ao estado de visibilidade do modal
    this.modalService.modalVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe((visible) => {
        this.visible = visible;
        if (this.visible) {
          this.contacts = this.modalService.getUsers().pipe(
            map((usersObj: any) =>
              Object.entries(usersObj).map(([name, id]) => ({
                name,
                id,
              }))
            )
          );

          console.log(this.contacts);
        }
        console.log(this.visible);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startMessage(id: string) {
    this.socketService.startMessage(id);
  }
  

  contacts: any = [];
}
