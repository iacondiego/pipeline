'use client'

import { ContactWithStats } from '../types'

interface ContactsTableProps {
  contacts: ContactWithStats[]
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="card-glass rounded-xl p-12 text-center">
        <p className="text-gray-500 dark:text-dark-400">No hay contactos registrados</p>
      </div>
    )
  }

  return (
    <div className="card-glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-dark-300">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-dark-300">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.phone}
                className="border-b border-gray-100 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-electric-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-500 dark:text-electric-400 font-semibold">
                        {contact.nombres.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-dark-100 font-medium">{contact.nombres}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-600 dark:text-dark-300">{contact.phone}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
