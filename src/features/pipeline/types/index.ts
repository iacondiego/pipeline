import { z } from 'zod'

// Etapas del pipeline inmobiliario
export const PIPELINE_STAGES = [
  'En atención por IA',
  'En atención humana',
  'Interesado en visitar',
  'No asiste a cita',
  'Esperando respuesta',
  'Venta ganada',
  'Nutrición',
] as const

export type PipelineStage = typeof PIPELINE_STAGES[number]

// Colores distintivos para cada etapa inmobiliaria
export const STAGE_COLORS = {
  'En atención por IA': {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    accent: 'bg-blue-500',
    hover: 'hover:border-blue-500/50',
  },
  'En atención humana': {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    accent: 'bg-cyan-500',
    hover: 'hover:border-cyan-500/50',
  },
  'Interesado en visitar': {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    accent: 'bg-amber-500',
    hover: 'hover:border-amber-500/50',
  },
  'No asiste a cita': {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    accent: 'bg-red-500',
    hover: 'hover:border-red-500/50',
  },
  'Esperando respuesta': {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    accent: 'bg-purple-500',
    hover: 'hover:border-purple-500/50',
  },
  'Venta ganada': {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    accent: 'bg-emerald-500',
    hover: 'hover:border-emerald-500/50',
  },
  'Nutrición': {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    accent: 'bg-slate-500',
    hover: 'hover:border-slate-500/50',
  },
} as const

export const LeadSchema = z.object({
  phone: z.string().min(1, 'El teléfono es requerido'),
  nombres: z.string().min(1, 'El nombre es requerido'),
  interes_propiedad: z.string().min(1, 'El interés en propiedad es requerido'),
  stage: z.enum(PIPELINE_STAGES),
  contact_phone: z.string().optional().nullable(), // Referencia al contacto asociado
  notes: z.string().optional().nullable(), // Notas del lead
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Lead = z.infer<typeof LeadSchema>

// Tipos de propiedades disponibles
export const PROPERTY_TYPES = [
  'Departamento',
  'Casa',
  'Casa + Jardín',
  'Terreno',
  'Local Comercial',
  'Oficina',
] as const

export type PropertyType = typeof PROPERTY_TYPES[number]

export interface StageColumn {
  id: PipelineStage
  title: PipelineStage
  leads: Lead[]
  count: number
  propertyTypes: Record<string, number> // Conteo por tipo de propiedad
}

export interface PipelineStats {
  totalLeads: number
  totalValue: number
  stageStats: {
    stage: PipelineStage
    count: number
    value: number
  }[]
}
