import { Marca } from "./marca";
import { Categoria } from "./categoria";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_venta: number;
    costo_compra: number;
    stock: number;
    stock_minimo: number;
    codigo: string;
    imagen_url?: string;
    marca_id?: number;
    categoria_id?: number;
    creado_en: Date;
    actualizado_en: Date;
    marca?: Marca;
    categoria?: Categoria;
}

export interface ProductoSimple {
    id: number;
    nombre: string;
    stock?: number; 
}



