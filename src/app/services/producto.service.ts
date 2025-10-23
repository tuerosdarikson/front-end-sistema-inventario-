import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '@interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly baseUrl = 'http://localhost:8080/api/productos'; // Cambia si tu backend corre en otro puerto

  constructor(private http: HttpClient) {}

  /**  Listar productos con paginación */
  listarProductos(page: number = 0, size: number = 10): Observable<Producto[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<Producto[]>(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
  }

  /**  Obtener producto por ID */
  obtenerProductoPorId(producto_id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${producto_id}`)
      .pipe(catchError(this.handleError));
  }

  filtrarProductos(filtro: Producto, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.post<Producto>(`${this.baseUrl}/filtrar`, filtro, { params })
      .pipe(catchError(this.handleError));
  }

  registrarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto)
      .pipe(catchError(this.handleError));
  }

  actualizarProducto(producto_id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${producto_id}`, producto)
      .pipe(catchError(this.handleError));
  }

  eliminarProducto(producto_id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${producto_id}`)
      .pipe(catchError(this.handleError));
  }

  /** ⚠️ Manejo centralizado de errores */
  private handleError(error: HttpErrorResponse) {
    let mensajeError = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error del cliente: ${error.error.message}`;
    } else if (error.status === 0) {
      mensajeError = 'No se pudo conectar con el servidor.';
    } else {
      mensajeError = `Error ${error.status}: ${error.error?.message || error.message}`;
    }

    console.error('Detalles del error:', error);
    return throwError(() => new Error(mensajeError));
  }
}
