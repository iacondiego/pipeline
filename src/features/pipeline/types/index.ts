import { z } from 'zod'

export const PIPELINE_STAGES = [
  'Prospecto',
  'Contactado',
  'Interesado',
  'Propuesta enviada',
] as const

export type PipelineStage = typeof PIPELINE_STAGES[number]

// Colores distintivos para cada etapa
export const STAGE_COLORS = {
  'Prospecto': {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    accent: 'bg-purple-500',
    hover: 'hover:border-purple-500/50',
  },
  'Contactado': {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    accent: 'bg-blue-500',
    hover: 'hover:border-blue-500/50',
  },
  'Interesado': {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    accent: 'bg-amber-500',
    hover: 'hover:border-amber-500/50',
  },
  'Propuesta enviada': {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    accent: 'bg-emerald-500',
    hover: 'hover:border-emerald-500/50',
  },
} as const

export const LeadSchema = z.object({
  phone: z.string().min(1, 'El teléfono es requerido'),
  nombres: z.string().min(1, 'El nombre es requerido'),
  estimated_value: z.number().min(0, 'El valor debe ser positivo'),
  stage: z.enum(PIPELINE_STAGES),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Lead = z.infer<typeof LeadSchema>

export interface StageColumn {
  id: PipelineStage
  title: PipelineStage
  leads: Lead[]
  totalValue: number
  count: number
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
