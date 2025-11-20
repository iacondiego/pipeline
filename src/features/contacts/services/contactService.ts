import { supabase } from '@/shared/lib/supabase'
import {
  Contact,
  ContactWithStats,
  CreateContactInput,
  UpdateContactInput,
  ContactFilters,
  ContactSort,
} from '../types'

export const contactService = {
  /**
   * Obtener todos los contactos
   */
  async getAll(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      throw new Error(`Error al obtener contactos: ${error.message}`)
    }

    return data || []
  },

  /**
   * Obtener contactos con estadísticas de oportunidades
   */
  async getAllWithStats(): Promise<ContactWithStats[]> {
    const { data, error } = await supabase.rpc('get_contacts_with_stats')

    if (error) {
      // Si la función no existe, usar query manual
      console.warn('RPC function not found, using manual query')
      return this.getAllWithStatsManual()
    }

    return data || []
  },

  /**
   * Fallback manual para obtener contactos con stats
   */
  async getAllWithStatsManual(): Promise<ContactWithStats[]> {
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (contactsError) {
      throw new Error(`Error al obtener contactos: ${contactsError.message}`)
    }

    // Obtener conteo de oportunidades por contacto
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('contact_phone, stage')

    if (leadsError) {
      throw new Error(`Error al obtener oportunidades: ${leadsError.message}`)
    }

    // Agrupar oportunidades por contacto
    const statsMap = new Map<string, { total: number; activas: number; ganadas: number }>()

    leads?.forEach((lead) => {
      if (!lead.contact_phone) return

      const stats = statsMap.get(lead.contact_phone) || { total: 0, activas: 0, ganadas: 0 }
      stats.total++

      if (lead.stage === 'Venta ganada') {
        stats.ganadas++
      } else if (lead.stage !== 'Nutrición') {
        stats.activas++
      }

      statsMap.set(lead.contact_phone, stats)
    })

    // Combinar contactos con estadísticas
    return contacts.map((contact) => {
      const stats = statsMap.get(contact.phone) || { total: 0, activas: 0, ganadas: 0 }
      return {
        ...contact,
        total_oportunidades: stats.total,
        oportunidades_activas: stats.activas,
        oportunidades_ganadas: stats.ganadas,
      }
    })
  },

  /**
   * Obtener un contacto por teléfono
   */
  async getByPhone(phone: string): Promise<Contact | null> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No encontrado
      }
      throw new Error(`Error al obtener contacto: ${error.message}`)
    }

    return data
  },

  /**
   * Crear un nuevo contacto
   */
  async create(input: CreateContactInput): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([input])
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      throw new Error(`Error al crear contacto: ${error.message}`)
    }

    return data
  },

  /**
   * Crear o actualizar un contacto (upsert)
   */
  async upsert(input: CreateContactInput): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .upsert([input], { onConflict: 'phone' })
      .select()
      .single()

    if (error) {
      console.error('Error upserting contact:', error)
      throw new Error(`Error al guardar contacto: ${error.message}`)
    }

    return data
  },

  /**
   * Actualizar un contacto existente
   */
  async update(input: UpdateContactInput): Promise<Contact> {
    const { phone, ...updates } = input

    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('phone', phone)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      throw new Error(`Error al actualizar contacto: ${error.message}`)
    }

    return data
  },

  /**
   * Eliminar un contacto
   */
  async delete(phone: string): Promise<void> {
    const { error } = await supabase.from('contacts').delete().eq('phone', phone)

    if (error) {
      console.error('Error deleting contact:', error)
      throw new Error(`Error al eliminar contacto: ${error.message}`)
    }
  },

  /**
   * Buscar contactos con filtros
   */
  async search(filters: ContactFilters, sort?: ContactSort): Promise<ContactWithStats[]> {
    let query = supabase.from('contacts').select('*')

    // Aplicar filtro de búsqueda
    if (filters.search) {
      query = query.or(
        `nombres.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      )
    }

    // Aplicar filtro de empresa
    if (filters.empresa) {
      query = query.eq('empresa', filters.empresa)
    }

    // Aplicar filtro de tags
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags)
    }

    // Aplicar ordenamiento
    if (sort) {
      query = query.order(sort.field, { ascending: sort.order === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Error al buscar contactos: ${error.message}`)
    }

    // Si necesitamos filtrar por oportunidades, hacer join manual
    if (filters.hasOpportunities !== undefined) {
      const contactsWithStats = await this.getAllWithStatsManual()
      return contactsWithStats.filter((contact) => {
        if (filters.hasOpportunities) {
          return contact.total_oportunidades > 0
        }
        return contact.total_oportunidades === 0
      })
    }

    // Enriquecer con estadísticas
    const statsMap = new Map<string, { total: number; activas: number; ganadas: number }>()
    const { data: leads } = await supabase.from('leads').select('contact_phone, stage')

    leads?.forEach((lead) => {
      if (!lead.contact_phone) return
      const stats = statsMap.get(lead.contact_phone) || { total: 0, activas: 0, ganadas: 0 }
      stats.total++
      if (lead.stage === 'Venta ganada') stats.ganadas++
      else if (lead.stage !== 'Nutrición') stats.activas++
      statsMap.set(lead.contact_phone, stats)
    })

    return (
      data?.map((contact) => {
        const stats = statsMap.get(contact.phone) || { total: 0, activas: 0, ganadas: 0 }
        return {
          ...contact,
          total_oportunidades: stats.total,
          oportunidades_activas: stats.activas,
          oportunidades_ganadas: stats.ganadas,
        }
      }) || []
    )
  },

  /**
   * Suscribirse a cambios en la tabla contacts
   */
  subscribe(callback: (payload: any) => void) {
    return supabase
      .channel('contacts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, callback)
      .subscribe()
  },
}
