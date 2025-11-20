'use client'

import { useState, useEffect } from 'react'
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

  // Cargar contactos (sin useCallback para evitar dependencia circular)
  const loadContacts = async () => {
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
  }

  // Cargar contactos al montar el componente
  useEffect(() => {
    loadContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo cargar una vez al montar

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const channel = contactService.subscribe(() => {
      // Recargar contactos cuando hay cambios
      loadContacts()
    })

    return () => {
      channel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo suscribir una vez al montar

  // Crear un contacto
  const createContact = async (input: CreateContactInput): Promise<Contact> => {
    try {
      const newContact = await contactService.create(input)
      await loadContacts() // Recargar para obtener stats actualizadas
      return newContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear contacto'
      setError(errorMessage)
      throw err
    }
  }

  // Crear o actualizar contacto (upsert)
  const upsertContact = async (input: CreateContactInput): Promise<Contact> => {
    try {
      const contact = await contactService.upsert(input)
      await loadContacts()
      return contact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar contacto'
      setError(errorMessage)
      throw err
    }
  }

  // Actualizar un contacto
  const updateContact = async (input: UpdateContactInput): Promise<Contact> => {
    try {
      const updatedContact = await contactService.update(input)
      await loadContacts()
      return updatedContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar contacto'
      setError(errorMessage)
      throw err
    }
  }

  // Eliminar un contacto
  const deleteContact = async (phone: string): Promise<void> => {
    try {
      await contactService.delete(phone)
      await loadContacts()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar contacto'
      setError(errorMessage)
      throw err
    }
  }

  // Buscar contactos con filtros
  const searchContacts = async (
    filters: ContactFilters,
    sort?: ContactSort
  ): Promise<ContactWithStats[]> => {
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
  }

  // Obtener un contacto por teléfono
  const getContactByPhone = async (phone: string): Promise<Contact | null> => {
    try {
      return await contactService.getByPhone(phone)
    } catch (err) {
      console.error('Error getting contact:', err)
      return null
    }
  }

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
