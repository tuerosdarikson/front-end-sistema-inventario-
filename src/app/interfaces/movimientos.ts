import { Producto, ProductoSimple } from "./producto";
import { usuariosimple } from "./usuario";

export enum TipoMovimiento {
    ENTRADA = 'ENTRADA',
    SALIDA = 'SALIDA',
    DEVOLUCION_CLIENTE = 'DEVOLUCION_CLIENTE',
    DEVOLUCION_PROVEEDOR = 'DEVOLUCION_PROVEEDOR'
}

export interface MovimientoStock {
    id: number;
    producto: ProductoSimple;
    tipo_movimiento: TipoMovimiento;
    usuario_id: number;
    usuario: usuariosimple;
    cantidad: number;
    fecha: Date;
    referencia?: string;
}

export interface MovimientoPayload {
  producto_id: number;  
  tipo_movimiento: TipoMovimiento;
  cantidad: number;
  fecha: Date;
  referencia?: string;
}

