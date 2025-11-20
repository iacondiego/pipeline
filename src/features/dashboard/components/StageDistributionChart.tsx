'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { StageMetric } from '../types'
import { PipelineStage } from '@/features/pipeline/types'

interface StageDistributionChartProps {
  data: StageMetric[]
}

// Colores que coinciden con STAGE_COLORS del pipeline
const STAGE_CHART_COLORS: Record<PipelineStage, string> = {
  'Prospecto': '#a855f7',        // purple-500
  'Contactado': '#3b82f6',       // blue-500
  'Interesado': '#f59e0b',       // amber-500
  'Propuesta enviada': '#10b981', // emerald-500
}

export function StageDistributionChart({ data }: StageDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: item.stage,
    value: item.count,
    color: STAGE_CHART_COLORS[item.stage as PipelineStage] || '#00a0ff'
  }))

  return (
    <div className="card-glass rounded-xl p-6 h-full">
      <h3 className="text-xl font-bold text-gradient mb-6">Distribución por Etapa</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1c1c2a',
              border: '1px solid #333344',
              borderRadius: '8px',
              color: '#f5f5f7',
            }}
          />
          <Legend
            wrapperStyle={{
              color: '#a3a3b0',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
