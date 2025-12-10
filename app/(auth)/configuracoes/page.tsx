import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>
            Esta página está em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá configurar preferências, perfil e outras opções do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
