import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];

  filtroTexto = '';
  filtroTipo = '';

  clientesFiltrados: any[] = [];

  // nuevo: estado para mostrar el formulario de creación
  showCreateForm = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/api/clientes')
      .subscribe(res => {
        this.clientes = res;
        this.clientesFiltrados = [...this.clientes]; // copia inicial
      });

    // Revisar queryParams para abrir modal si se pasó ?new=true
    this.route.queryParams.subscribe(params => {
      if (params['new']) {
        this.openCreateModal();
      }
    });
  }

  openCreateModal() {
    this.showCreateForm = true;
  }

  closeCreateModal() {
    this.showCreateForm = false;
    // Limpiar el query param para evitar reabrir al navegar
    this.router.navigate([], { queryParams: { new: null }, queryParamsHandling: 'merge' });
  }

  // nuevo cliente state
  newCliente: any = { persona: { nombre: '', apellidoPaterno: '', apellidoMaterno: '', correo: '', telefono: '' }, tipoCliente: 'PARTICULAR' };
  isSubmitting = false;

  createCliente() {
    // validación simple
    if (!this.newCliente.persona.nombre || !this.newCliente.persona.apellidoPaterno) {
      alert('Nombre y apellido paterno son requeridos');
      return;
    }

    this.isSubmitting = true;
    this.http.post<any>('http://localhost:8080/api/clientes', this.newCliente)
      .subscribe({
        next: (created) => {
          // agregar al arreglo local y refrescar vista
          this.clientes.unshift(created);
          this.aplicarFiltros();
          this.isSubmitting = false;
          this.closeCreateModal();
          // reset form
          this.newCliente = { persona: { nombre: '', apellidoPaterno: '', apellidoMaterno: '', correo: '', telefono: '' }, tipoCliente: 'PARTICULAR' };
        },
        error: (err) => {
          console.error('Error creando cliente', err);
          alert('Error creando cliente');
          this.isSubmitting = false;
        }
      });
  }

  // 👇 función para buscar por texto
  onSearch(event: any) {
    this.filtroTexto = event.target.value.toLowerCase();
    this.aplicarFiltros();
  }

  // 👇 función para filtrar por tipo de cliente
  filterByType(tipo: string) {
    this.filtroTipo = tipo;
    this.aplicarFiltros();
  }

  // 👇 lógica común de filtros
  private aplicarFiltros() {
    this.clientesFiltrados = this.clientes.filter(cliente => {
      const coincideTexto =
        cliente.persona?.nombre?.toLowerCase().includes(this.filtroTexto) ||
        cliente.persona?.apellidoPaterno?.toLowerCase().includes(this.filtroTexto) ||
        cliente.razonSocial?.toLowerCase().includes(this.filtroTexto);

      const coincideTipo = this.filtroTipo
        ? (cliente.tipoCliente || '').toUpperCase() === this.filtroTipo.toUpperCase()
        : true;

      return coincideTexto && coincideTipo;
    });
  }
}
