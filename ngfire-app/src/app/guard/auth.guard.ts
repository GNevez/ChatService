import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private sessaoService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.sessaoService.estaLogado()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
