'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DemandasData {
  data: string
  demandas_atendidas: number
  demandas_nao_atendidas: number
}

interface DemandasChartProps {
  data: DemandasData[]
}

export function DemandasChart({ data }: DemandasChartProps) {
  // Transformar dados para o formato do Recharts
  const chartData = data.map((item) => ({
    date: format(parseISO(item.data), 'dd/MM', { locale: ptBR }),
    fullDate: format(parseISO(item.data), 'dd/MM/yyyy', { locale: ptBR }),
    atendidas: item.demandas_atendidas,
    naoAtendidas: item.demandas_nao_atendidas,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demandas no Período</CardTitle>
          <CardDescription>
            Evolução de demandas atendidas e não atendidas
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
        <CardTitle>Demandas no Período</CardTitle>
        <CardDescription>
          Evolução de demandas atendidas e não atendidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate
                }
                return label
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="atendidas"
              name="Atendidas"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
            <Line
              type="monotone"
              dataKey="naoAtendidas"
              name="Não Atendidas"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--destructive))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
