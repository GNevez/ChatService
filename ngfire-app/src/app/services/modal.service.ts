import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { env } from '../../env/environments';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private http: HttpClient) {}
  private modalVisibilitySubject = new Subject<boolean>();
  modalVisibility$ = this.modalVisibilitySubject.asObservable();

  openModal() {
    this.modalVisibilitySubject.next(true);
  }

  closeModal() {
    this.modalVisibilitySubject.next(false);
  }

  getUsers() {
    const url = env.backServer + '/onlineUsers';
    return this.http.get<string[]>(url);
  }
}
