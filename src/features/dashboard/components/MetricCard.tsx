interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="card-glass card-glass-hover rounded-xl p-6 transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-dark-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gradient">{value}</h3>
          {subtitle && <p className="text-xs text-dark-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-electric-500/20 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-sm">
          <span
            className={`font-semibold ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
          </span>
          <span className="text-dark-500">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}
