import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title:       string
  value:       string | number
  subtitle?:   string
  icon?:       LucideIcon
  trend?:      { value: number; label: string }
  className?:  string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: Props) {
  return (
    <div className={cn('bg-background border rounded-xl p-5 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
