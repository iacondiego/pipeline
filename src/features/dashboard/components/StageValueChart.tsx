'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { StageMetric } from '../types'
import { PipelineStage } from '@/features/pipeline/types'

interface StageValueChartProps {
  data: StageMetric[]
}

// Colores que coinciden con STAGE_COLORS del pipeline
const STAGE_CHART_COLORS: Record<PipelineStage, string> = {
  'Prospecto': '#a855f7',        // purple-500
  'Contactado': '#3b82f6',       // blue-500
  'Interesado': '#f59e0b',       // amber-500
  'Propuesta enviada': '#10b981', // emerald-500
}

export function StageValueChart({ data }: StageValueChartProps) {
  const chartData = data.map((item) => ({
    stage: item.stage.length > 15 ? item.stage.substring(0, 12) + '...' : item.stage,
    fullStage: item.stage,
    'Valor Total': item.value,
    'Cantidad': item.count,
    color: STAGE_CHART_COLORS[item.stage as PipelineStage] || '#00a0ff'
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value)
  }

  return (
    <div className="card-glass rounded-xl p-6 h-full">
      <h3 className="text-xl font-bold text-gradient mb-6">Valor por Etapa</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333344" />
          <XAxis
            dataKey="stage"
            stroke="#a3a3b0"
            tick={{ fill: '#a3a3b0' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            stroke="#a3a3b0"
            tick={{ fill: '#a3a3b0' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1c1c2a',
              border: '1px solid #333344',
              borderRadius: '8px',
              color: '#f5f5f7',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Valor Total') {
                return formatCurrency(value)
              }
              return value
            }}
          />
          <Legend wrapperStyle={{ color: '#a3a3b0' }} />
          <Bar dataKey="Valor Total" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
