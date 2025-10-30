import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '@services/cliente.service';
import { ProductoService } from '@services/producto.service';
import { MovimientoService } from '@services/movimiento.service';
import { MarcaService } from '@services/marca.service';
import { CategoriaService } from '@services/categoria.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);
  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);

  clientesCount = 0;
  productosCount = 0;
  movimientosCount = 0;
  marcasCount = 0;
  categoriasCount = 0;

  loading = true;
  errorMessage: string | null = null;

  recentMovimientos: any[] = [];
  sparklinePath = '';

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics() {
    this.loading = true;
    this.errorMessage = null;

    forkJoin({
      clientes: this.clienteService.list(),
      productos: this.productoService.listarProductos(0, 1000),
      movimientos: this.movimientoService.list(),
      marcas: this.marcaService.list(),
      categorias: this.categoriaService.list()
    }).subscribe({
      next: (res: any) => {
        try {
          const clientes = res.clientes;
          const productos = res.productos;
          const movimientos = res.movimientos;
          const marcas = res.marcas;
          const categorias = res.categorias;

          const c = clientes as any;
          this.clientesCount = Array.isArray(c) ? c.length : (c?.length ?? 0);

          const prodArray = (productos as any)?.content ?? (productos as any)?.data ?? (productos as any) ?? [];
          this.productosCount = Array.isArray(prodArray) ? prodArray.length : 0;

          const m = movimientos as any;
          this.movimientosCount = Array.isArray(m) ? m.length : 0;

          const ma = marcas as any;
          this.marcasCount = Array.isArray(ma) ? ma.length : 0;

          const cat = categorias as any;
          this.categoriasCount = Array.isArray(cat) ? cat.length : 0;

          // últimos movimientos (10 más recientes)
          const movs = Array.isArray(movimientos) ? movimientos.slice() : [];
          movs.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          this.recentMovimientos = movs.slice(0, 10);

          // construir sparkline con últimos 7 días
          this.sparklinePath = this.buildSparklineFromMovements(movs);
        } catch (e) {
          console.error('Error parsing metrics', e);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard metrics', err);
        this.errorMessage = 'No se pudieron cargar las métricas';
        this.loading = false;
      }
    });
  }

  buildSparklineFromMovements(movimientos: any[], days = 7, width = 140, height = 30): string {
    const counts: number[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      const c = movimientos.filter((m: any) => {
        const f = new Date(m.fecha);
        return f >= start && f <= end;
      }).length;
      counts.push(c);
    }

    if (counts.length === 0) return '';

    const max = Math.max(...counts) || 1;
    const stepX = width / (counts.length - 1 || 1);
    const points = counts.map((v, i) => {
      const x = Math.round(i * stepX);
      const y = Math.round(height - (v / max) * height);
      return `${x},${y}`;
    });

    // return polyline points string for <polyline>
    return points.join(' ');
  }
}
