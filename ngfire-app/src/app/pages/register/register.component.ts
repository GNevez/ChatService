import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  user: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  onSubmit() {
    this.authService.register(this.user, this.email, this.password)
      .then(() => {
        console.log('Usuário cadastrado com sucesso!');
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Erro ao cadastrar:', error);
      });
  }
}
