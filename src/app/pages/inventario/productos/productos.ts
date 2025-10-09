import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit {
  productos = [
    {
      id: 1,
      nombre: 'Filtro de Aceite',
      codigo: 'FIL-001',
      categoria: 'Filtros',
      stock: 45,
      precio: 12.99
    },
    {
      id: 2,
      nombre: 'Pastillas de Freno',
      codigo: 'FRE-002',
      categoria: 'Frenos',
      stock: 8,
      precio: 45.50
    },
    {
      id: 3,
      nombre: 'Bujía NGK',
      codigo: 'BUJ-003',
      categoria: 'Encendido',
      stock: 0,
      precio: 8.75
    },
    {
      id: 4,
      nombre: 'Aceite Motor 5W-30',
      codigo: 'ACE-004',
      categoria: 'Lubricantes',
      stock: 25,
      precio: 32.99
    },
    {
      id: 5,
      nombre: 'Bomba de Agua',
      codigo: 'REF-005',
      categoria: 'Refrigeración',
      stock: 5,
      precio: 89.99
    }
  ];

  // estado para modal de creación
  showCreateForm = false;
  newProducto: any = { nombre: '', codigo: '', categoria: '', stock: 0, precio: 0 };
  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['new']) {
        this.showCreateForm = true;
      }
    });
  }

  openCreateModal() {
    // navegamos con query param para preservar patrón usado en otras páginas
    this.router.navigate([], { queryParams: { new: true }, queryParamsHandling: 'merge' });
    this.showCreateForm = true;
  }

  closeCreateModal() {
    this.showCreateForm = false;
    // limpiar query param
    this.router.navigate([], { queryParams: { new: null }, queryParamsHandling: 'merge' });
  }

  createProducto() {
    if (!this.newProducto.nombre || !this.newProducto.codigo) {
      alert('Nombre y código son requeridos');
      return;
    }

    this.isSubmitting = true;

    // generar id simple y agregar al arreglo local
    const maxId = this.productos.reduce((m, p) => Math.max(m, p.id || 0), 0);
    const created = { id: maxId + 1, ...this.newProducto };
    this.productos.unshift(created);

    // reset
    this.isSubmitting = false;
    this.newProducto = { nombre: '', codigo: '', categoria: '', stock: 0, precio: 0 };
    this.closeCreateModal();
  }
}