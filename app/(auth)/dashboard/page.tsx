import { Suspense } from 'react'
import { getUser } from '@/lib/auth'
import {
  getDashboardKPIs,
  getTopTopicos,
  getDemandasTimeline,
  getCondominiosStats,
  type PeriodType
} from '@/lib/queries/dashboard'
import { DashboardContent } from './components/DashboardContent'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// ISR: Revalidar a cada 5 minutos (300 segundos)
export const revalidate = 300

// Gerar metadata dinamicamente
export async function generateMetadata() {
  return {
    title: 'Dashboard | CondoAssist',
    description: 'Painel de controle e métricas do CondoAssist',
  }
}

// Skeleton otimizado para KPI Cards
function KPIsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton otimizado para gráficos
function ChartsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

// Skeleton otimizado para tabela
function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente que carrega dados reais do Supabase
async function DashboardData({ period }: { period: PeriodType }) {
  // Buscar todos os dados em paralelo para máxima performance
  const [kpis, topicos, demandas, condominios] = await Promise.all([
    getDashboardKPIs(period),
    getTopTopicos(period),
    getDemandasTimeline(period),
    getCondominiosStats(period),
  ])

  return (
    <DashboardContent
      period={period}
      kpis={kpis}
      topicos={topicos}
      demandas={demandas}
      condominios={condominios}
    />
  )
}

interface DashboardPageProps {
  searchParams: Promise<{ period?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Carrega user e searchParams em paralelo
  const [user, params] = await Promise.all([
    getUser(),
    searchParams,
  ])

  const period = (params.period as PeriodType) || '30days'

  return (
    <div className="space-y-6">
      {/* Page Header - Carrega imediatamente (First Paint) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.nome}!
          </p>
        </div>
      </div>

      {/* Dashboard com Streaming SSR e Suspense */}
      {/* Usa fallback otimizado com skeletons realistas */}
      <Suspense fallback={
        <div className="space-y-6 animate-in fade-in duration-300">
          <Skeleton className="h-10 w-64" />
          <KPIsSkeleton />
          <ChartsSkeleton />
          <TableSkeleton />
        </div>
      }>
        <DashboardData period={period} />
      </Suspense>
    </div>
  )
}
