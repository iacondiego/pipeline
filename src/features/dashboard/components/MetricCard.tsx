interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'purple' | 'blue' | 'amber' | 'emerald' | 'electric'
}

const colorClasses = {
  purple: {
    bg: 'bg-purple-500/10',
    iconBg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  blue: {
    bg: 'bg-blue-500/10',
    iconBg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10',
    iconBg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    iconBg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  electric: {
    bg: 'bg-electric-500/10',
    iconBg: 'bg-electric-500/20',
    text: 'text-electric-400',
    border: 'border-electric-500/30',
  },
}

export function MetricCard({ title, value, subtitle, icon, trend, color = 'electric' }: MetricCardProps) {
  const colors = colorClasses[color]

  return (
    <div className={`card-glass card-glass-hover rounded-xl p-6 transition-all duration-300 animate-slide-up border-2 ${colors.border} ${colors.bg}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-dark-400 mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${colors.text}`}>{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 dark:text-dark-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
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
          <span className="text-gray-400 dark:text-dark-500">vs mes anterior</span>
        </div>
      )}
    </div>
  )
}
