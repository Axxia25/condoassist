import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie todos os usuários do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Esta página está em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá visualizar, criar, editar e desativar usuários.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
