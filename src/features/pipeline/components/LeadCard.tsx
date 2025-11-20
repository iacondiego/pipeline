import { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Lead, STAGE_COLORS } from '../types'

interface LeadCardProps {
  lead: Lead
}

function LeadCardComponent({ lead }: LeadCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative p-3.5 rounded-lg
        card-glass border-2 ${colors.border}
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-out
        ${colors.hover} hover:scale-[1.02] hover:shadow-lg
        ${isDragging ? 'opacity-30 scale-90 shadow-2xl' : 'opacity-100'}
      `}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-dark-50 group-hover:${colors.text} transition-colors truncate`}>
              {lead.nombres}
            </h3>
            <p className="text-xs text-dark-400 truncate font-mono">
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
            <p className="text-xs text-dark-400">Interés en:</p>
            <p className={`font-semibold ${colors.text} text-sm truncate`}>
              {lead.interes_propiedad}
            </p>
          </div>
        </div>

        <div className="h-1.5 w-full bg-dark-700/60 rounded-full overflow-hidden border border-dark-600/30">
          <div className={`h-full ${colors.accent} rounded-full animate-pulse-slow`} />
        </div>
      </div>

      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-transparent to-transparent group-hover:${colors.bg} transition-all duration-200 pointer-events-none`} />
    </div>
  )
}

export const LeadCard = memo(LeadCardComponent)
