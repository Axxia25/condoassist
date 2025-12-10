import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon: LucideIcon
  loading?: boolean
}

export function KPICard({ title, value, change, icon: Icon, loading = false }: KPICardProps) {
  const isPositive = change && change.value > 0
  const isNegative = change && change.value < 0

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-7 w-24 animate-pulse bg-muted rounded" />
          <div className="mt-2 h-4 w-32 animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                'font-medium',
                isPositive && 'text-green-600 dark:text-green-500',
                isNegative && 'text-red-600 dark:text-red-500'
              )}
            >
              {isPositive && '+'}
              {change.value}%
            </span>{' '}
            {change.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
