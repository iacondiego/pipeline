'use client'

import { useState, useEffect } from 'react'

interface ContactsSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function ContactsSearch({
  onSearch,
  placeholder = 'Buscar por nombre, email o teléfono...',
}: ContactsSearchProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-dark-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-12 py-3
            bg-dark-800/50 border border-dark-700 rounded-lg
            text-dark-100 placeholder-dark-500
            focus:outline-none focus:ring-2 focus:ring-electric-500/50 focus:border-electric-500
            transition-all duration-200
          "
        />

        {query && (
          <button
            onClick={handleClear}
            className="
              absolute inset-y-0 right-0 pr-4 flex items-center
              text-dark-400 hover:text-dark-200 transition-colors
            "
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
