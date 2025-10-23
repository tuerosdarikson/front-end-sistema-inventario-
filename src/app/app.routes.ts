import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ClientesComponent } from './pages/clientes/clientes';
import { PagesLayout } from './layouts/pages/pages';
import { AuthLayout } from './layouts/auth/auth';
import { InventarioComponent } from './pages/inventario/inventario';
import { CategoriasComponent } from '@pages/inventario/categorias/categorias';
import { CategoriaFormComponent } from './components/form/categoria/categoria.form';
import { MovimientosComponent } from './pages/inventario/movimientos/movimientos';
import { ProductosComponent } from './pages/inventario/productos/productos';
import { MarcasComponent } from '@pages/inventario/marcas/marcas';
import { MarcaFormComponent } from '@components/form/marca/marca.form';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PagesLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'inventario', component: InventarioComponent, children: [
          { path: '', redirectTo: 'productos', pathMatch: 'full' },

          //categorias
          { path: 'categorias', component: CategoriasComponent },
          { path: 'categorias/nueva', component: CategoriaFormComponent },
          { path: 'categorias/:id/edit', component: CategoriaFormComponent },
          //marcas
          { path: 'marcas', component: MarcasComponent },
          { path: 'marcas/nueva', component: MarcaFormComponent },
          { path: 'marcas/:id/edit', component: MarcaFormComponent },
          { path: 'movimientos', component: MovimientosComponent },
          { path: 'productos', component: ProductosComponent },
        ]
      },
      { path: 'clientes', component: ClientesComponent },
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
