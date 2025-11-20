import { memo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Lead } from '../types'

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

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative p-3.5 rounded-lg
        card-glass border-2 border-electric-500/30
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-out
        hover:border-electric-500/70 hover:scale-[1.02] hover:shadow-lg
        hover:shadow-electric-500/20
        ${isDragging ? 'opacity-30 scale-90 shadow-2xl shadow-electric-500/40' : 'opacity-100'}
      `}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark-50 group-hover:text-electric-300 transition-colors truncate">
              {lead.nombres}
            </h3>
            <p className="text-xs text-dark-400 truncate font-mono">
              {lead.phone}
            </p>
          </div>
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-electric-400 animate-pulse-slow" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-dark-300 font-medium">Valor</span>
          <span className="font-bold text-electric-300 text-sm">
            {formatCurrency(lead.estimated_value)}
          </span>
        </div>

        <div className="h-1.5 w-full bg-dark-700/60 rounded-full overflow-hidden border border-dark-600/30">
          <div className="h-full bg-gradient-to-r from-electric-500 via-electric-400 to-electric-500 rounded-full animate-pulse-slow" />
        </div>
      </div>

      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-electric-500/0 to-electric-500/0 group-hover:from-electric-500/5 group-hover:to-electric-500/10 transition-all duration-200 pointer-events-none" />
    </div>
  )
}

export const LeadCard = memo(LeadCardComponent)
