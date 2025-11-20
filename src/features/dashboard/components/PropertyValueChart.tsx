'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PropertyMetric } from '../types'

interface PropertyValueChartProps {
  data: PropertyMetric[]
}

export function PropertyValueChart({ data }: PropertyValueChartProps) {
  const chartData = data.map((item) => ({
    name: item.propertyType,
    cantidad: item.count,
  }))

  return (
    <div className="card-glass rounded-xl p-6">
      <h3 className="text-xl font-bold text-gradient mb-6">Leads por Tipo de Propiedad</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-dark-500">No hay datos disponibles</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a0a12',
                border: '1px solid #1f1f2e',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#00a0ff' }}
            />
            <Bar dataKey="cantidad" fill="#00a0ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
