'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { PropertyMetric } from '../types'

interface PropertyDistributionChartProps {
  data: PropertyMetric[]
}

const PROPERTY_COLORS = [
  '#00a0ff', // Azul eléctrico
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
]

export function PropertyDistributionChart({ data }: PropertyDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: item.propertyType,
    value: item.count,
  }))

  return (
    <div className="card-glass rounded-xl p-6">
      <h3 className="text-xl font-bold text-gradient mb-6">Distribución por Tipo de Propiedad</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-dark-500">No hay datos disponibles</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PROPERTY_COLORS[index % PROPERTY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a12',
                border: '1px solid #1f1f2e',
                borderRadius: '8px',
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
