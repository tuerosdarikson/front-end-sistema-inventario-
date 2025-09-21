import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  persona = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: ''
  };
  contrasenia = '';

  // 👇 propiedades usadas en tu HTML
  showPassword = false;
  isLoading = false;
  passwordStrength = 0;

  fieldErrors: Record<string, boolean> = {
    nombre: false,
    apellidoPaterno: false,
    apellidoMaterno: false,
    correo: false,
    telefono: false,
    contrasenia: false
  };

  constructor(private authService: AuthService) {}

  // 👇 funciones que tu template necesita
  validateField(field: NgModel, key: string) {
    const value = field.value || '';
    this.fieldErrors[key] = !value || value.trim().length < 2;
  }

  validatePhone(field: NgModel) {
    const value = field.value || '';
    const regex = /^[0-9]{9}$/; // ejemplo Perú: 9 dígitos
    this.fieldErrors['telefono'] = !regex.test(value);
  }

  validateEmail(field: NgModel) {
    const value = field.value || '';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.fieldErrors['correo'] = !regex.test(value);
  }

  validatePassword(field: NgModel) {
    const value = field.value || '';
    this.fieldErrors['contrasenia'] = value.length < 6;
  }

  updatePasswordStrength() {
    if (this.contrasenia.length >= 12) this.passwordStrength = 100;
    else if (this.contrasenia.length >= 8) this.passwordStrength = 70;
    else if (this.contrasenia.length >= 6) this.passwordStrength = 40;
    else this.passwordStrength = 10;
  }

  getPasswordStrengthColor(): string {
    if (this.passwordStrength >= 70) return 'green';
    if (this.passwordStrength >= 40) return 'orange';
    return 'red';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    // si hay errores en algún campo, abortar
    if (Object.values(this.fieldErrors).some(err => err)) {
      alert('Por favor corrige los errores antes de continuar.');
      return;
    }

    this.isLoading = true;
    const data = {
      persona: this.persona,
      contrasenia: this.contrasenia,
      rolId: 1,
      estado: 'ACTIVO'
    };

    this.authService.register(data).subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false)
    });
  }
}
