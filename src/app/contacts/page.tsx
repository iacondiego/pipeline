'use client'

import { Navigation } from '@/shared/components/Navigation'
import { useContacts } from '@/features/contacts/hooks/useContacts'
import { ContactsTable } from '@/features/contacts/components/ContactsTable'

export default function ContactsPage() {
  const { contacts, isLoading, error } = useContacts()

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
                Lista de contactos registrados
              </p>
            </div>
            <div className="card-glass px-4 py-2 rounded-lg">
              <p className="text-sm text-dark-400">Total</p>
              <p className="text-2xl font-bold text-electric-400">{contacts.length}</p>
            </div>
          </div>

          {/* Tabla de contactos */}
          <ContactsTable contacts={contacts} />
        </div>
      </main>
    </div>
  )
}
