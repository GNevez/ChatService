import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  sessionPersist: boolean = false;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onCheckboxChange(): void {
    console.log('Checkbox atualizado:', this.sessionPersist);
  }

  onSubmit() {
    this.authService.login(this.email, this.password, this.sessionPersist)
      .then(() => {
        console.log('Login realizado com sucesso!');
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}