'use client'

import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import { MetricCard } from './MetricCard'
import { StageDistributionChart } from './StageDistributionChart'
import { StageValueChart } from './StageValueChart'
import { PipelineStage, STAGE_COLORS } from '@/features/pipeline/types'

export function DashboardView() {
  const { metrics, stageMetrics, isLoading, error } = useDashboardMetrics()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-dark-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4 p-8 card-glass rounded-xl max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
            <p className="text-dark-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-dark-400">Métricas y análisis del pipeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Leads"
          value={metrics.totalLeads}
          subtitle="Todos los leads en el pipeline"
          color="purple"
          icon={
            <svg
              className="w-6 h-6 text-purple-400"
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
          }
        />

        <MetricCard
          title="Valor Total del Pipeline"
          value={formatCurrency(metrics.totalValue)}
          subtitle="Suma de todos los leads"
          color="blue"
          icon={
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <MetricCard
          title="Leads Últimos 7 Días"
          value={metrics.leadsLast7Days}
          subtitle="Nuevos leads esta semana"
          color="amber"
          icon={
            <svg
              className="w-6 h-6 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <MetricCard
          title="Tasa de Conversión"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          subtitle="Leads en propuesta enviada"
          color="emerald"
          icon={
            <svg
              className="w-6 h-6 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StageDistributionChart data={stageMetrics} />
        <StageValueChart data={stageMetrics} />
      </div>

      <div className="card-glass rounded-xl p-6">
        <h3 className="text-xl font-bold text-gradient mb-4">Detalle por Etapa</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-400 font-medium">Etapa</th>
                <th className="text-right py-3 px-4 text-dark-400 font-medium">Cantidad</th>
                <th className="text-right py-3 px-4 text-dark-400 font-medium">Valor Total</th>
                <th className="text-right py-3 px-4 text-dark-400 font-medium">% del Total</th>
              </tr>
            </thead>
            <tbody>
              {stageMetrics.map((stage, index) => {
                const colors = STAGE_COLORS[stage.stage as PipelineStage]
                return (
                  <tr
                    key={stage.stage}
                    className={`border-b ${colors.border} hover:${colors.bg} transition-colors ${
                      index % 2 === 0 ? 'bg-dark-900/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors.accent}`} />
                        <span className={`${colors.text} font-medium`}>{stage.stage}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`${colors.text} font-semibold`}>{stage.count}</span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={`${colors.text} font-bold`}>{formatCurrency(stage.value)}</span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className="text-dark-300">{stage.percentage.toFixed(1)}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
