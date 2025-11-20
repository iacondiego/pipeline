'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { StageMetric } from '../types'

interface StageDistributionChartProps {
  data: StageMetric[]
}

const COLORS = ['#00a0ff', '#0088cc', '#006699', '#004466']

export function StageDistributionChart({ data }: StageDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: item.stage,
    value: item.count,
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
