import { PersonaCreate } from "./persona";

export enum TipoCliente {
  EMPRESA = 'EMPRESA',
  PERSONA_NATURAL = 'PERSONA_NATURAL'
}

export interface Cliente {
    id: number;
    persona: PersonaCreate;
    tipo_cliente: TipoCliente;
    razon_social: string | null;
    documento_identidad?: string | null;
    creado_en?: Date;
    actualizado_en?: Date;
    ruc_empresa?: string | null;
}

export interface ClienteCreate{
    persona: PersonaCreate;
    tipo_cliente: TipoCliente;
    razon_social?: string | null;
    documento_identidad?: string | null;
    ruc_empresa?: string | null;
}

