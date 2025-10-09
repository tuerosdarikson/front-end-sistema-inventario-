import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  correo = '';
  contrasenia = '';

  // recordar sesión
  remember = false;

  // 👇 nuevas propiedades
  showPassword = false;
  isLoading = false;
  emailValid = true;
  passwordValid = true;

  constructor(private authService: AuthService) {}

  // 👇 nuevas funciones
  validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValid = regex.test(this.correo);
  }

  validatePassword() {
    this.passwordValid = this.contrasenia.length >= 6;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.emailValid || !this.passwordValid) {
      alert('Por favor ingrese un correo válido y contraseña de mínimo 6 caracteres.');
      return;
    }

    this.isLoading = true;
    this.authService.login({ correo: this.correo, contrasenia: this.contrasenia })
      .subscribe({
        next: () => this.isLoading = false,
        error: () => this.isLoading = false
      });
  }
}
