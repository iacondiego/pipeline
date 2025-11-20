export interface Property {
  id: string;
  numero: number | null;
  agente: string;
  telefono: string;
  property_id: string;
  estado: string;
  propiedad: string;
  titulo_publicacion: string;
  direccion_publicacion: string;
  operacion: string;
  requisitos_alquiler: string | null;
  piso: string | null;
  barrio: string;
  tipo: string;
  link: string;
  ambientes: number | null;
  amenities: string | null;
  m2_cubiertos: number | null;
  m2_semicubiertos: number | null;
  m2_descubiertos: number | null;
  m2_total: number | null;
  m2_ponderados: number | null;
  valor_m2: string | null;
  valor_actual: string | null;
  valor_anterior: string | null;
  porcentaje_bajado: string | null;
  expensas: string | null;
  es_apto_credito: string | null;
  es_apto_profesional: string | null;
  acepta_financiacion_permuta: string | null;
  modalidad_visitas: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  numero?: number | null;
  agente: string;
  telefono: string;
  property_id: string;
  estado: string;
  propiedad: string;
  titulo_publicacion: string;
  direccion_publicacion: string;
  operacion: string;
  requisitos_alquiler?: string | null;
  piso?: string | null;
  barrio: string;
  tipo: string;
  link: string;
  ambientes?: number | null;
  amenities?: string | null;
  m2_cubiertos?: number | null;
  m2_semicubiertos?: number | null;
  m2_descubiertos?: number | null;
  m2_total?: number | null;
  m2_ponderados?: number | null;
  valor_m2?: string | null;
  valor_actual?: string | null;
  valor_anterior?: string | null;
  porcentaje_bajado?: string | null;
  expensas?: string | null;
  es_apto_credito?: string | null;
  es_apto_profesional?: string | null;
  acepta_financiacion_permuta?: string | null;
  modalidad_visitas?: string | null;
}

export type PropertyFilters = {
  estado?: string;
  tipo?: string;
  barrio?: string;
  agente?: string;
  search?: string;
};
