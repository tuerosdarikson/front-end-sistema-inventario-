import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovimientoPayload, MovimientoStock } from '@interfaces/movimientos';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private http = inject(HttpClient);
  private baseQuery = 'http://localhost:8080/api/movimientos-stock/query';
  private baseCommand = 'http://localhost:8080/api/movimientos-stock/command';

  // Listar todos los movimientos
  list() {
    return this.http.get<MovimientoStock[]>(this.baseQuery);
  }

  // Obtener movimiento por ID
  get(id: number) {
    return this.http.get<MovimientoStock>(`${this.baseQuery}/${id}`);
  }

  // Obtener movimientos por producto
  getByProductoId(productoId: number) {
    return this.http.get<MovimientoStock[]>(`${this.baseQuery}/producto/${productoId}`);
  }

  // Crear un nuevo movimiento
  create(movimiento: MovimientoPayload) {
    return this.http.post<MovimientoStock>(this.baseCommand, movimiento);
  }

  // Eliminar un movimiento (solo si agregas DELETE en backend)
  delete(id: number) {
    return this.http.delete<void>(`${this.baseCommand}/${id}`);
  }
}
