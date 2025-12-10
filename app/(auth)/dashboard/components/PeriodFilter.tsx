'use client'

import { useTransition } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import type { PeriodType } from '@/lib/queries/dashboard'
import { cn } from '@/lib/utils'

interface PeriodFilterProps {
  value: PeriodType
  onChange: (value: PeriodType) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (newValue: string) => {
    startTransition(() => {
      onChange(newValue as PeriodType)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Tabs value={value} onValueChange={handleChange}>
        <TabsList className={cn(isPending && 'opacity-60 pointer-events-none')}>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="7days">7 dias</TabsTrigger>
          <TabsTrigger value="30days">30 dias</TabsTrigger>
          <TabsTrigger value="90days">90 dias</TabsTrigger>
          <TabsTrigger value="year">Este ano</TabsTrigger>
        </TabsList>
      </Tabs>
      {isPending && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
    </div>
  )
}
