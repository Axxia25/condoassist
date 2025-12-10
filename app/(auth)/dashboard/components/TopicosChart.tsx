'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TopicosData {
  topico: string
  total_buscas: number
}

interface TopicosChartProps {
  data: TopicosData[]
}

export function TopicosChart({ data }: TopicosChartProps) {
  // Limitar o tamanho do nome do tópico para melhor visualização
  const chartData = data.map((item) => ({
    topico: item.topico.length > 20 ? item.topico.substring(0, 20) + '...' : item.topico,
    fullTopico: item.topico,
    buscas: item.total_buscas,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Tópicos</CardTitle>
          <CardDescription>
            Os 10 tópicos mais buscados no período
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Nenhum dado disponível para o período selecionado
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Tópicos</CardTitle>
        <CardDescription>
          Os {chartData.length} tópicos mais buscados no período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              type="category"
              dataKey="topico"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullTopico
                }
                return label
              }}
              formatter={(value: number) => [value, 'Buscas']}
            />
            <Bar
              dataKey="buscas"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
