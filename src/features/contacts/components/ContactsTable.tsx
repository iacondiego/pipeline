'use client'

import { ContactWithStats } from '../types'

interface ContactsTableProps {
  contacts: ContactWithStats[]
  onSelectContact?: (contact: ContactWithStats) => void
}

export function ContactsTable({ contacts, onSelectContact }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="card-glass rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-dark-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <p className="text-dark-400">No hay contactos registrados</p>
      </div>
    )
  }

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Teléfono</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-dark-300">Empresa</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-dark-300">
                Oportunidades
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-dark-300">Tags</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.phone}
                onClick={() => onSelectContact?.(contact)}
                className="border-b border-dark-700/50 hover:bg-dark-800/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-400 font-semibold">
                        {contact.nombres.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-dark-100 font-medium">{contact.nombres}</p>
                      {contact.cargo && (
                        <p className="text-xs text-dark-500">{contact.cargo}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-dark-300">{contact.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-dark-300">{contact.email || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-dark-300">{contact.empresa || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-electric-400">
                        {contact.total_oportunidades}
                      </p>
                      <p className="text-xs text-dark-500">Total</p>
                    </div>
                    {contact.oportunidades_activas > 0 && (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-amber-400">
                          {contact.oportunidades_activas}
                        </p>
                        <p className="text-xs text-dark-500">Activas</p>
                      </div>
                    )}
                    {contact.oportunidades_ganadas > 0 && (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-emerald-400">
                          {contact.oportunidades_ganadas}
                        </p>
                        <p className="text-xs text-dark-500">Ganadas</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {contact.tags && contact.tags.length > 0 ? (
                      contact.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium bg-electric-500/20 text-electric-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-dark-500 text-sm">-</span>
                    )}
                    {contact.tags && contact.tags.length > 2 && (
                      <span className="text-xs text-dark-500">+{contact.tags.length - 2}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
