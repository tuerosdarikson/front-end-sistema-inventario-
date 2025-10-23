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

export interface PersonaCreate{
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}