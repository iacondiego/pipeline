'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { StageMetric } from '../types'
import { PipelineStage } from '@/features/pipeline/types'

interface StageValueChartProps {
  data: StageMetric[]
}

// Colores que coinciden con STAGE_COLORS del pipeline inmobiliario
const STAGE_CHART_COLORS: Record<PipelineStage, string> = {
  'En atención por IA': '#3b82f6',    // blue-500
  'En atención humana': '#06b6d4',    // cyan-500
  'Interesado en visitar': '#f59e0b', // amber-500
  'No asiste a cita': '#ef4444',      // red-500
  'Esperando respuesta': '#a855f7',   // purple-500
  'Venta ganada': '#10b981',          // emerald-500
  'Nutrición': '#64748b',             // slate-500
}

export function StageValueChart({ data }: StageValueChartProps) {
  const chartData = data.map((item) => ({
    stage: item.stage.length > 18 ? item.stage.substring(0, 15) + '...' : item.stage,
    fullStage: item.stage,
    'Cantidad de Leads': item.count,
    color: STAGE_CHART_COLORS[item.stage as PipelineStage] || '#00a0ff'
  }))

  return (
    <div className="card-glass rounded-xl p-6 h-full">
      <h3 className="text-xl font-bold text-gradient mb-6">Leads por Etapa</h3>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1c1c2a',
              border: '1px solid #333344',
              borderRadius: '8px',
              color: '#f5f5f7',
            }}
          />
          <Legend wrapperStyle={{ color: '#a3a3b0' }} />
          <Bar dataKey="Cantidad de Leads" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
