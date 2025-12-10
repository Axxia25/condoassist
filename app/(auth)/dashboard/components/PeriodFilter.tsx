'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PeriodType } from '@/lib/queries/dashboard'

interface PeriodFilterProps {
  value: PeriodType
  onChange: (value: PeriodType) => void
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as PeriodType)}>
      <TabsList>
        <TabsTrigger value="today">Hoje</TabsTrigger>
        <TabsTrigger value="7days">7 dias</TabsTrigger>
        <TabsTrigger value="30days">30 dias</TabsTrigger>
        <TabsTrigger value="90days">90 dias</TabsTrigger>
        <TabsTrigger value="year">Este ano</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
