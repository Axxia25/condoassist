import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CondominiosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Condomínios</h1>
        <p className="text-muted-foreground">
          Gerencie todos os condomínios do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Condomínios</CardTitle>
          <CardDescription>
            Esta página está em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá visualizar, criar, editar e gerenciar condomínios.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
