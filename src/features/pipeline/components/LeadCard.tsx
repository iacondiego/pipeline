'use client'

import { memo, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Lead, STAGE_COLORS } from '../types'

interface LeadCardProps {
  lead: Lead
  onUpdateNotes: (phone: string, notes: string) => void
}

function LeadCardComponent({ lead, onUpdateNotes }: LeadCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(lead.notes || '')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: lead.phone,
    data: {
      type: 'lead',
      lead
    }
  })

  const colors = STAGE_COLORS[lead.stage]

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  // Ícono según tipo de propiedad
  const getPropertyIcon = () => {
    const property = lead.interes_propiedad.toLowerCase()
    if (property.includes('departamento')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    } else if (property.includes('terreno')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  }

  const handleSaveNotes = () => {
    onUpdateNotes(lead.phone, notes)
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setNotes(lead.notes || '')
    setIsEditingNotes(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative p-3.5 rounded-lg
        card-glass border-2 ${colors.border}
        transition-all duration-200 ease-out
        ${colors.hover} hover:scale-[1.02] hover:shadow-lg
        ${isDragging ? 'opacity-30 scale-90 shadow-2xl' : 'opacity-100'}
        ${isEditingNotes ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
      `}
    >
      <div
        {...(isEditingNotes ? {} : attributes)}
        {...(isEditingNotes ? {} : listeners)}
        className="space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 dark:text-dark-50 group-hover:${colors.text} transition-colors truncate`}>
              {lead.nombres}
            </h3>
            <p className="text-xs text-gray-500 dark:text-dark-400 truncate font-mono">
              {lead.phone}
            </p>
          </div>
          <div className={`flex-shrink-0 w-2 h-2 rounded-full ${colors.accent} animate-pulse-slow`} />
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${colors.bg} ${colors.text}`}>
            {getPropertyIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-dark-400">Interés en:</p>
            <p className={`font-semibold ${colors.text} text-sm truncate`}>
              {lead.interes_propiedad}
            </p>
          </div>
        </div>

        {/* Notas Section */}
        <div className="space-y-1.5">
          {isEditingNotes ? (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar nota..."
                className="w-full px-2 py-1.5 text-xs bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded text-gray-900 dark:text-dark-100 placeholder-gray-400 dark:placeholder-dark-500 focus:border-electric-500 focus:ring-1 focus:ring-electric-500 outline-none resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex gap-1.5">
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 px-2 py-1 text-xs bg-electric-500 text-white rounded hover:bg-electric-600 transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelNotes}
                  className="flex-1 px-2 py-1 text-xs bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-dark-300 rounded hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditingNotes(true)
              }}
              className="w-full text-left px-2 py-1.5 text-xs bg-gray-50 dark:bg-dark-800/50 border border-gray-200 dark:border-dark-700/50 rounded text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-200 hover:border-gray-300 dark:hover:border-dark-600 transition-colors"
            >
              {notes ? (
                <div className="flex items-start gap-1.5">
                  <svg className="w-3 h-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 line-clamp-2">{notes}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Agregar nota</span>
                </div>
              )}
            </button>
          )}
        </div>

        <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-700/60 rounded-full overflow-hidden border border-gray-300 dark:border-dark-600/30">
          <div className={`h-full ${colors.accent} rounded-full animate-pulse-slow`} />
        </div>
      </div>

      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-transparent to-transparent group-hover:${colors.bg} transition-all duration-200 pointer-events-none`} />
    </div>
  )
}

export const LeadCard = memo(LeadCardComponent)
