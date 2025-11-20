'use client'

import { useCallback } from 'react'
import { Navigation } from '@/shared/components/Navigation'
import { useContacts } from '@/features/contacts/hooks/useContacts'
import { ContactsTable } from '@/features/contacts/components/ContactsTable'
import { ContactsSearch } from '@/features/contacts/components/ContactsSearch'
import { ContactWithStats } from '@/features/contacts/types'

export default function ContactsPage() {
  const { contacts, isLoading, error, searchContacts, loadContacts } = useContacts()

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.trim()) {
        await searchContacts({ search: query })
      } else {
        await loadContacts()
      }
    },
    [searchContacts, loadContacts]
  )

  const handleSelectContact = (contact: ContactWithStats) => {
    console.log('Selected contact:', contact)
    // TODO: Abrir modal con detalles del contacto
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navigation />
        <main className="ml-64 min-h-screen">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-dark-400">Cargando contactos...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navigation />
        <main className="ml-64 min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            <div className="card-glass rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Error al cargar contactos</h3>
              <p className="text-dark-400">{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navigation />
      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Contactos</h1>
              <p className="text-dark-400">
                Gestiona tus contactos y visualiza sus oportunidades
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="card-glass px-4 py-2 rounded-lg">
                <p className="text-sm text-dark-400">Total de contactos</p>
                <p className="text-2xl font-bold text-electric-400">{contacts.length}</p>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-electric-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-dark-300">Total Contactos</h3>
              </div>
              <p className="text-3xl font-bold text-white">{contacts.length}</p>
            </div>

            <div className="card-glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-dark-300">Con Oportunidades</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {contacts.filter((c) => c.total_oportunidades > 0).length}
              </p>
            </div>

            <div className="card-glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-dark-300">Con Ventas</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {contacts.filter((c) => c.oportunidades_ganadas > 0).length}
              </p>
            </div>

            <div className="card-glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-dark-300">Con Tags</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {contacts.filter((c) => c.tags && c.tags.length > 0).length}
              </p>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="card-glass rounded-xl p-6">
            <ContactsSearch onSearch={handleSearch} />
          </div>

          {/* Tabla de contactos */}
          <ContactsTable contacts={contacts} onSelectContact={handleSelectContact} />
        </div>
      </main>
    </div>
  )
}
