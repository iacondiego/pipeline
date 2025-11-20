import { useDroppable } from '@dnd-kit/core'
import { StageColumn } from '../types'
import { LeadCard } from './LeadCard'

interface KanbanColumnProps {
  column: StageColumn
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      stage: column.id
    }
  })

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
      className={`
        flex flex-col h-full min-w-[360px] max-w-[420px] flex-shrink-0
        transition-all duration-200
        ${isOver ? 'ring-2 ring-electric-500' : ''}
      `}
    >
      {/* Header con mejor contraste */}
      <div className="card-glass rounded-t-xl p-4 border-b-2 border-electric-500/50 bg-gradient-to-r from-dark-800/80 via-dark-800/60 to-dark-900/40">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-electric-300">{column.title}</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-electric-500/30 rounded-full border border-electric-500/50">
              <span className="text-sm font-bold text-electric-200">
                {column.count}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm text-dark-300">Total:</span>
            <span className="text-xl font-bold text-electric-300">
              {formatCurrency(column.totalValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor de leads con mejor contraste */}
      <div
        className={`
          flex-1 card-glass rounded-b-xl p-4 overflow-y-auto scrollbar-thin space-y-3 min-h-[500px]
          transition-all duration-200
          ${isOver ? 'bg-dark-700/50 border-b-2 border-electric-500' : 'border-b-2 border-dark-700/50'}
        `}
      >
        {column.leads.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-dark-800 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-dark-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p>Sin leads en esta etapa</p>
            </div>
          </div>
        ) : (
          column.leads.map((lead) => <LeadCard key={lead.phone} lead={lead} />)
        )}
      </div>
    </div>
  )
}
