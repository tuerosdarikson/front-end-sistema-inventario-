import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Injectable({
 providedIn: 'root'

})

export class AuthService {
 private apiUrl = 'http://localhost:8080/api/auth';

 constructor(private http: HttpClient, private router: Router) {}

 login(data: { correo: string; contrasenia: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, data).pipe(
   tap((res: any) => {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('tokenType', res.tokenType || 'Bearer');
    this.router.navigate(['/clientes']);
   })

  );

 }
 register(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register`, data).pipe(
   tap(() => {
    this.router.navigate(['/login']);
   })
  );
 }

 logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenType');
  this.router.navigate(['/login']);
 }

 getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
 }
 getTokenType(): string {
  return localStorage.getItem('tokenType') || 'Bearer';
 }

 isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

 LoginComponent(){}
}