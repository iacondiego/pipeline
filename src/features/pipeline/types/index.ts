import { z } from 'zod'

export const PIPELINE_STAGES = [
  'Prospecto',
  'Contactado',
  'Interesado',
  'Propuesta enviada',
] as const

export type PipelineStage = typeof PIPELINE_STAGES[number]

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
