'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { KPICard } from './KPICard'
import { PeriodFilter } from './PeriodFilter'
// Imports específicos para tree shaking
import {
  BarChart3,
  Users,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import type { PeriodType } from '@/lib/queries/dashboard'

// Lazy load dos gráficos Recharts (reduz bundle inicial)
const DemandasChart = dynamic(() => import('./DemandasChart').then(mod => ({ default: mod.DemandasChart })), {
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Demandas no Período</CardTitle>
        <CardDescription>Evolução de demandas atendidas e não atendidas</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-80 w-full" />
      </CardContent>
    </Card>
  ),
  ssr: false,
})

const TopicosChart = dynamic(() => import('./TopicosChart').then(mod => ({ default: mod.TopicosChart })), {
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Top Tópicos</CardTitle>
        <CardDescription>Os tópicos mais buscados no período</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-80 w-full" />
      </CardContent>
    </Card>
  ),
  ssr: false,
})

const CondominiosTable = dynamic(() => import('./CondominiosTable').then(mod => ({ default: mod.CondominiosTable })), {
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Condomínios</CardTitle>
        <CardDescription>Resumo de métricas por condomínio</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-60 w-full" />
      </CardContent>
    </Card>
  ),
  ssr: false,
})

interface DashboardContentProps {
  period: PeriodType
  kpis: {
    usuarios: { total: number; change: number }
    buscas: { total: number; change: number }
    nps: { score: number; total: number }
    interacoes: { total: number; change: number }
  }
  topicos: Array<{ topico: string; total_buscas: number }>
  demandas: Array<{ data: string; demandas_atendidas: number; demandas_nao_atendidas: number }>
  condominios: Array<{
    condominio_id: number
    condominio: string
    total_ciclos: number
    nps_medio: number
  }>
}

export function DashboardContent({
  period,
  kpis,
  topicos,
  demandas,
  condominios,
}: DashboardContentProps) {
  const router = useRouter()

  const handlePeriodChange = (newPeriod: PeriodType) => {
    router.push(`/dashboard?period=${newPeriod}`)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Period Filter */}
      <PeriodFilter value={period} onChange={handlePeriodChange} />

      {/* KPI Cards Grid com animação escalonada */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '0ms' }}>
          <KPICard
            title="Usuários Únicos"
            value={kpis.usuarios.total.toLocaleString('pt-BR')}
            change={{
              value: kpis.usuarios.change,
              label: 'vs. período anterior',
            }}
            icon={Users}
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '100ms' }}>
          <KPICard
            title="Buscas RAG"
            value={kpis.buscas.total.toLocaleString('pt-BR')}
            change={{
              value: kpis.buscas.change,
              label: 'vs. período anterior',
            }}
            icon={BarChart3}
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '200ms' }}>
          <KPICard
            title="NPS Médio"
            value={kpis.nps.score.toFixed(1)}
            change={
              kpis.nps.total > 0
                ? {
                    value: 0, // TODO: Calcular mudança vs período anterior
                    label: `${kpis.nps.total} respostas`,
                  }
                : undefined
            }
            icon={ThumbsUp}
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: '300ms' }}>
          <KPICard
            title="Interações Síndicos"
            value={kpis.interacoes.total.toLocaleString('pt-BR')}
            change={{
              value: kpis.interacoes.change,
              label: 'vs. período anterior',
            }}
            icon={MessageSquare}
          />
        </div>
      </div>

      {/* Charts com animação */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: '400ms' }}>
          <DemandasChart data={demandas} />
        </div>
        <div className="animate-in fade-in slide-in-from-right-4 duration-700" style={{ animationDelay: '400ms' }}>
          <TopicosChart data={topicos} />
        </div>
      </div>

      {/* Tabela de Condomínios com animação */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '600ms' }}>
        <CondominiosTable data={condominios} />
      </div>
    </div>
  )
}
