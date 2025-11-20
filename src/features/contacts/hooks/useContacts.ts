'use client'

import { useState, useEffect, useCallback } from 'react'
import { contactService } from '../services/contactService'
import {
  Contact,
  ContactWithStats,
  CreateContactInput,
  UpdateContactInput,
  ContactFilters,
  ContactSort,
} from '../types'

export function useContacts() {
  const [contacts, setContacts] = useState<ContactWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar contactos inicial
  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await contactService.getAllWithStats()
      setContacts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error loading contacts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar contactos al montar el componente
  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const channel = contactService.subscribe((payload) => {
      console.log('Contact change detected:', payload)
      loadContacts() // Recargar contactos cuando hay cambios
    })

    return () => {
      channel.unsubscribe()
    }
  }, [loadContacts])

  // Crear un contacto
  const createContact = useCallback(
    async (input: CreateContactInput): Promise<Contact> => {
      try {
        const newContact = await contactService.create(input)
        await loadContacts() // Recargar para obtener stats actualizadas
        return newContact
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al crear contacto'
        setError(errorMessage)
        throw err
      }
    },
    [loadContacts]
  )

  // Crear o actualizar contacto (upsert)
  const upsertContact = useCallback(
    async (input: CreateContactInput): Promise<Contact> => {
      try {
        const contact = await contactService.upsert(input)
        await loadContacts()
        return contact
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al guardar contacto'
        setError(errorMessage)
        throw err
      }
    },
    [loadContacts]
  )

  // Actualizar un contacto
  const updateContact = useCallback(
    async (input: UpdateContactInput): Promise<Contact> => {
      try {
        const updatedContact = await contactService.update(input)
        await loadContacts()
        return updatedContact
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar contacto'
        setError(errorMessage)
        throw err
      }
    },
    [loadContacts]
  )

  // Eliminar un contacto
  const deleteContact = useCallback(
    async (phone: string): Promise<void> => {
      try {
        await contactService.delete(phone)
        await loadContacts()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar contacto'
        setError(errorMessage)
        throw err
      }
    },
    [loadContacts]
  )

  // Buscar contactos con filtros
  const searchContacts = useCallback(
    async (filters: ContactFilters, sort?: ContactSort): Promise<ContactWithStats[]> => {
      try {
        setIsLoading(true)
        setError(null)
        const results = await contactService.search(filters, sort)
        setContacts(results)
        return results
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al buscar contactos'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Obtener un contacto por teléfono
  const getContactByPhone = useCallback(async (phone: string): Promise<Contact | null> => {
    try {
      return await contactService.getByPhone(phone)
    } catch (err) {
      console.error('Error getting contact:', err)
      return null
    }
  }, [])

  return {
    contacts,
    isLoading,
    error,
    loadContacts,
    createContact,
    upsertContact,
    updateContact,
    deleteContact,
    searchContacts,
    getContactByPhone,
  }
}
