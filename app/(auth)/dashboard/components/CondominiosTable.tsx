'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Eye } from 'lucide-react'

interface CondominioData {
  condominio_id: number
  condominio: string
  total_ciclos: number
  nps_medio: number
}

interface CondominiosTableProps {
  data: CondominioData[]
}

export function CondominiosTable({ data }: CondominiosTableProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Condomínios</CardTitle>
          <CardDescription>
            Resumo de métricas por condomínio
          </CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Nenhum condomínio encontrado para o período selecionado
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condomínios</CardTitle>
        <CardDescription>
          Resumo de métricas por condomínio no período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                  Condomínio
                </th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  Ciclos
                </th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  NPS Médio
                </th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((condo) => (
                <tr key={condo.condominio_id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3">
                    <div className="font-medium">{condo.condominio}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-sm">{condo.total_ciclos}</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-medium">
                        {condo.nps_medio ? condo.nps_medio.toFixed(1) : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Link href={`/condominios/${condo.condominio_id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalhes
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
