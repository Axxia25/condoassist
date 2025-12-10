export function Footer() {
  const currentYear = new Date().getFullYear()
  const lastUpdate = new Date().toLocaleDateString('pt-BR')

  return (
    <footer className="border-t bg-background">
      <div className="container flex h-12 items-center justify-between px-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>© {currentYear} Fluxo TI</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">v1.0.0</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Última atualização: {lastUpdate}</span>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Documentação
          </a>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  )
}
