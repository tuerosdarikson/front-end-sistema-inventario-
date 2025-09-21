import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ClientesComponent } from './pages/clientes/clientes';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
