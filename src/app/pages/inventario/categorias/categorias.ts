import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {
  categorias = [
    {
      id: 1,
      nombre: 'Filtros',
      productos: 25,
      descripcion: 'Filtros de aceite, aire y combustible'
    },
    {
      id: 2,
      nombre: 'Frenos',
      productos: 32,
      descripcion: 'Sistema de frenos y componentes'
    },
    {
      id: 3,
      nombre: 'Lubricantes',
      productos: 15,
      descripcion: 'Aceites y lubricantes'
    },
    {
      id: 4,
      nombre: 'Repuestos de Motor',
      productos: 45,
      descripcion: 'Componentes internos del motor'
    },
    {
      id: 5,
      nombre: 'Suspensión',
      productos: 28,
      descripcion: 'Amortiguadores y componentes'
    },
    {
      id: 6,
      nombre: 'Encendido',
      productos: 18,
      descripcion: 'Sistema de encendido'
    },
    {
      id: 7,
      nombre: 'Refrigeración',
      productos: 12,
      descripcion: 'Sistema de refrigeración'
    },
    {
      id: 8,
      nombre: 'Eléctricos',
      productos: 35,
      descripcion: 'Componentes eléctricos'
    }
  ];

  // modal state
  showCreateForm = false;
  newCategoria: any = { nombre: '', descripcion: '' };
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['new']) this.showCreateForm = true;
    });
  }

  openCreateModal() {
    this.router.navigate([], { queryParams: { new: true }, queryParamsHandling: 'merge' });
    this.showCreateForm = true;
  }

  closeCreateModal() {
    this.showCreateForm = false;
    this.router.navigate([], { queryParams: { new: null }, queryParamsHandling: 'merge' });
  }

  createCategoria() {
    if (!this.newCategoria.nombre) {
      alert('El nombre de la categoría es requerido');
      return;
    }
    this.isSubmitting = true;
    const maxId = this.categorias.reduce((m, c) => Math.max(m, c.id || 0), 0);
    const created = { id: maxId + 1, nombre: this.newCategoria.nombre, productos: 0, descripcion: this.newCategoria.descripcion };
    this.categorias.unshift(created);
    this.newCategoria = { nombre: '', descripcion: '' };
    this.isSubmitting = false;
    this.closeCreateModal();
  }
}