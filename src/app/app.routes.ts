import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ClientesComponent } from './pages/clientes/clientes';
import { PagesLayout } from './layouts/pages/pages';
import { AuthLayout } from './layouts/auth/auth';
import { InventarioComponent } from './pages/inventario/inventario';
import { CategoriasComponent } from './pages/inventario/categorias/categorias';
import { MovimientosComponent } from './pages/inventario/movimientos/movimientos';
import { ProductosComponent } from './pages/inventario/productos/productos';

export const routes: Routes = [
  {
    path: '',
    component: PagesLayout,
    children: [
      {
        path: 'inventario', component: InventarioComponent, children: [
          { path: '', redirectTo: 'productos', pathMatch: 'full' },
          { path: 'categorias', component: CategoriasComponent },
          { path: 'movimientos', component: MovimientosComponent },
          { path: 'productos', component: ProductosComponent },
        ]
      },
      { path: 'cliente', component: ClientesComponent },
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  }
];
