import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimientos.html'
})
export class MovimientosComponent implements OnInit {
  movimientos = [
    {
      id: 1,
      fecha: '2025-09-26',
      tipo: 'entrada',
      producto: 'Filtro de Aceite',
      cantidad: 50,
      usuario: 'Juan Pérez',
      notas: 'Reposición de stock'
    },
    {
      id: 2,
      fecha: '2025-09-26',
      tipo: 'salida',
      producto: 'Pastillas de Freno',
      cantidad: 2,
      usuario: 'María García',
      notas: 'Venta a cliente'
    },
    {
      id: 3,
      fecha: '2025-09-25',
      tipo: 'entrada',
      producto: 'Aceite Motor 5W-30',
      cantidad: 24,
      usuario: 'Carlos Rodríguez',
      notas: 'Pedido mensual'
    },
    {
      id: 4,
      fecha: '2025-09-25',
      tipo: 'salida',
      producto: 'Bujía NGK',
      cantidad: 4,
      usuario: 'Ana López',
      notas: 'Servicio de mantenimiento'
    },
    {
      id: 5,
      fecha: '2025-09-24',
      tipo: 'entrada',
      producto: 'Bomba de Agua',
      cantidad: 5,
      usuario: 'Pedro Martínez',
      notas: 'Nuevo proveedor'
    }
  ];

  // estado modal y nuevo movimiento
  showCreateForm = false;
  isSubmitting = false;
  newMovimiento: any = { fecha: new Date().toISOString().slice(0,10), tipo: 'entrada', producto: '', cantidad: 1, usuario: '', notas: '' };

  // filtros
  filtroTipo = '';
  fechaDesde = '';
  fechaHasta = '';
  filtroProducto = '';
  movimientosFiltrados: any[] = [];

  openCreateModal(tipo: 'entrada' | 'salida') {
    this.newMovimiento = { fecha: new Date().toISOString().slice(0,10), tipo, producto: '', cantidad: 1, usuario: '', notas: '' };
    this.showCreateForm = true;
  }

  closeCreateModal() {
    this.showCreateForm = false;
  }

  createMovimiento() {
    if (!this.newMovimiento.producto || !this.newMovimiento.cantidad) {
      alert('Producto y cantidad son requeridos');
      return;
    }

    this.isSubmitting = true;
    const maxId = this.movimientos.reduce((m, mv) => Math.max(m, mv.id || 0), 0);
    const created = { id: maxId + 1, ...this.newMovimiento };
    this.movimientos.unshift(created);
    this.isSubmitting = false;
    this.closeCreateModal();
    this.aplicarFiltros();
  }

  ngOnInit() {
    // inicializar filtrados
    this.movimientosFiltrados = [...this.movimientos];
  }

  aplicarFiltros() {
    const desde = this.fechaDesde ? new Date(this.fechaDesde) : null;
    const hasta = this.fechaHasta ? new Date(this.fechaHasta) : null;

    this.movimientosFiltrados = this.movimientos.filter(mv => {
      // tipo
      if (this.filtroTipo && mv.tipo !== this.filtroTipo) return false;

      // fecha
      if (desde) {
        const f = new Date(mv.fecha);
        if (f < desde) return false;
      }
      if (hasta) {
        const f = new Date(mv.fecha);
        if (f > hasta) return false;
      }

      // producto
      if (this.filtroProducto) {
        const term = this.filtroProducto.toLowerCase();
        if (!mv.producto || !mv.producto.toLowerCase().includes(term)) return false;
      }

      return true;
    });
  }
}