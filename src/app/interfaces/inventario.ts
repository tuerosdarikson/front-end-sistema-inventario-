import { Producto } from "./producto";

export interface MovimientoStock {
    movimiento_stock_id: number;
    producto_id: number;
    producto: Producto;
    usuario_id: number;
    cantidad: number;
    fecha: Date;
    referencia?: string;
    creado_en: Date;
    actualizado_en: Date;
}


export interface TipoMovimiento {
    tipo_movimiento_id: number;
    nombre: string;
    descripcion: string;
    creado_en: Date;
    actualizado_en: Date;
}