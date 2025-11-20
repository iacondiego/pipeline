import { z } from 'zod'

// Schema de validación para Contact
export const ContactSchema = z.object({
  phone: z.string().min(1, 'El teléfono es requerido'),
  nombres: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().nullable(),
  empresa: z.string().optional().nullable(),
  cargo: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Contact = z.infer<typeof ContactSchema>

// Schema para crear un contacto (sin timestamps)
export const CreateContactSchema = ContactSchema.omit({
  created_at: true,
  updated_at: true,
})

export type CreateContactInput = z.infer<typeof CreateContactSchema>

// Schema para actualizar un contacto
export const UpdateContactSchema = CreateContactSchema.partial().required({
  phone: true,
})

export type UpdateContactInput = z.infer<typeof UpdateContactSchema>

// Tags predefinidos comunes
export const COMMON_TAGS = [
  'VIP',
  'Recurrente',
  'Nuevo',
  'Inactivo',
  'Potencial',
  'Inversor',
  'Primera vivienda',
  'Upgrade',
] as const

export type CommonTag = typeof COMMON_TAGS[number]

// Contacto con estadísticas de oportunidades
export interface ContactWithStats extends Contact {
  total_oportunidades: number
  oportunidades_activas: number
  oportunidades_ganadas: number
  ultima_interaccion?: string
}

// Filtros para búsqueda de contactos
export interface ContactFilters {
  search?: string
  tags?: string[]
  empresa?: string
  hasOpportunities?: boolean
}

// Ordenamiento de contactos
export type ContactSortField = 'nombres' | 'created_at' | 'updated_at' | 'total_oportunidades'
export type ContactSortOrder = 'asc' | 'desc'

export interface ContactSort {
  field: ContactSortField
  order: ContactSortOrder
}
