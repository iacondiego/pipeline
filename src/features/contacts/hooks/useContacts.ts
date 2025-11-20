'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { ContactWithStats } from '../types'

export function useContacts() {
  const [contacts, setContacts] = useState<ContactWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Convertir a ContactWithStats con valores por defecto
      const contactsWithStats: ContactWithStats[] = (data || []).map((contact) => ({
        ...contact,
        total_oportunidades: 0,
        oportunidades_activas: 0,
        oportunidades_ganadas: 0,
      }))

      setContacts(contactsWithStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error loading contacts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    contacts,
    isLoading,
    error,
  }
}
