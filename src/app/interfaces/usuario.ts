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

export interface Persona {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    correo: string;
    telefono: string;
    creado_en: Date;
    actualizado_en: Date;
}