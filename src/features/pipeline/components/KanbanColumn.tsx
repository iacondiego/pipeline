import { useDroppable } from '@dnd-kit/core'
import { StageColumn, STAGE_COLORS } from '../types'
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

  const colors = STAGE_COLORS[column.id]

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
        ${isOver ? `ring-2 ${colors.border.replace('border-', 'ring-')}` : ''}
      `}
    >
      {/* Header con colores por etapa */}
      <div className={`card-glass rounded-t-xl p-4 border-b-2 ${colors.border} ${colors.bg}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${colors.text}`}>{column.title}</h2>
            <div className={`flex items-center gap-2 px-3 py-1 ${colors.bg} rounded-full border ${colors.border}`}>
              <span className={`text-sm font-bold ${colors.text}`}>
                {column.count}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm text-dark-300">Total:</span>
            <span className={`text-xl font-bold ${colors.text}`}>
              {formatCurrency(column.totalValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor de leads con colores por etapa */}
      <div
        className={`
          flex-1 card-glass rounded-b-xl p-4 overflow-y-auto scrollbar-thin space-y-3 min-h-[500px]
          transition-all duration-200
          ${isOver ? `${colors.bg} border-b-2 ${colors.border}` : 'border-b-2 border-dark-700/50'}
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
