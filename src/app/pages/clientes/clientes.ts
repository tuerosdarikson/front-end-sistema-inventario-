import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  filtroTexto = '';
  filtroTipo = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/api/clientes')
      .subscribe(res => {
        this.clientes = res;
        this.clientesFiltrados = [...this.clientes]; // copia inicial
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
