import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function OcorrenciasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ocorrências</h1>
          <p className="text-muted-foreground">
            Gerencie todas as ocorrências reportadas
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          12 pendentes
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestão de Ocorrências</CardTitle>
          <CardDescription>
            Esta página está em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá visualizar, criar e gerenciar denúncias, reclamações e sugestões.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
