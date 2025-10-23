export interface Usuario {
    id: number;
    persona_id: number;
    contrasenia: string;
    rol_id: number;
    estado: boolean;
    creado_en: Date;
    actualizado_en: Date;
}

export interface Rol {
    rol_id: number;
    nombre: string;
    es_admin: boolean;
}

export interface usuariosimple{
    id: number;
    nombre: string;
}
