import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NPSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">NPS & Satisfação</h1>
        <p className="text-muted-foreground">
          Análise de satisfação dos usuários
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise de NPS</CardTitle>
          <CardDescription>
            Esta página está em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve você poderá visualizar distribuição de notas, comentários e tendências de satisfação.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
