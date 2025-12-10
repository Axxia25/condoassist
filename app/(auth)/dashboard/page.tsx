import { Suspense } from 'react'
import { getUser } from '@/lib/auth'
import { DashboardContent } from './components/DashboardContent'
import { mockKPIs, mockTopicos, mockDemandas, mockCondominios } from '@/lib/mock-data'
import { Skeleton } from '@/components/ui/skeleton'

// Streaming SSR para carregamento progressivo
export const dynamic = 'force-dynamic'

// Componente de loading leve
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-96" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await getUser()

  return (
    <div className="space-y-6">
      {/* Page Header - Carrega imediatamente */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.nome}!
          </p>
        </div>
      </div>

      {/* Dashboard com Streaming SSR */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent
          period="30days"
          kpis={mockKPIs}
          topicos={mockTopicos}
          demandas={mockDemandas}
          condominios={mockCondominios}
        />
      </Suspense>
    </div>
  )
}
