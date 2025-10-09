export interface Producto {
    producto_id: number;
    nombre: string;
    descripcion: string;
    precio_venta: number;
    costo_compra: number;
    stock: number;
    stock_minimo: number;
    codigo: string;
    imagen_url?: string;
    marca_id: number;
    marca: Marca;
    categoria_id: number;
    categoria: Categoria;
    creado_en: Date;
    actualizado_en: Date;
}

export interface Categoria {
    categoria_id: number;
    nombre: string;
}

export interface Marca {
    marca_id: number;
    nombre: string;
}