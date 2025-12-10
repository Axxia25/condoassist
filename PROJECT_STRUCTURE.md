# Estrutura do Projeto CondoAssist Dashboard

```
condoassist/
│
├── app/                              # Next.js 14 App Router
│   ├── (auth)/                       # Grupo de rotas autenticadas
│   │   ├── dashboard/                # Dashboard principal com KPIs
│   │   ├── condominios/              # Gestão de condomínios
│   │   ├── usuarios/                 # Gerenciamento de usuários
│   │   ├── ocorrencias/              # Gestão de ocorrências
│   │   └── nps/                      # Análise de satisfação (NPS)
│   │
│   ├── auth/                         # Rotas públicas de autenticação
│   │   ├── login/                    # Página de login
│   │   └── register/                 # Página de cadastro
│   │
│   ├── api/                          # API Routes e Server Actions
│   ├── layout.tsx                    # Layout raiz (será criado)
│   ├── page.tsx                      # Homepage (será criado)
│   └── globals.css                   # Estilos globais (será criado)
│
├── components/                       # Componentes React reutilizáveis
│   ├── ui/                          # Componentes shadcn/ui (button, card, etc)
│   ├── dashboard/                   # Componentes específicos do dashboard
│   ├── charts/                      # Componentes de gráficos (Recharts)
│   └── tables/                      # Componentes de tabelas com filtros
│
├── lib/                             # Utilitários e configurações
│   ├── supabase.ts                  # Cliente Supabase (será criado)
│   ├── auth.ts                      # Helpers de autenticação (será criado)
│   ├── types.ts                     # TypeScript types (será criado)
│   ├── utils.ts                     # Funções utilitárias (será criado)
│   └── constants.ts                 # Constantes da aplicação (será criado)
│
├── hooks/                           # Custom React Hooks
│   └── (hooks customizados como useKPIs, useAuth, etc)
│
├── stores/                          # Estado global (Zustand)
│   └── (stores para gerenciar estado se necessário)
│
├── sql/                             # Scripts SQL
│   ├── migrations/                  # Migrations do banco de dados
│   ├── seeds/                       # Dados iniciais (seed data)
│   └── views/                       # Database views para analytics
│
├── public/                          # Arquivos estáticos
│   └── (imagens, ícones, etc)
│
├── .env.local                       # Variáveis de ambiente (será criado)
├── next.config.js                   # Configuração do Next.js (será criado)
├── tailwind.config.ts               # Configuração do Tailwind (será criado)
├── tsconfig.json                    # Configuração do TypeScript (será criado)
├── package.json                     # Dependências do projeto (será criado)
├── CLAUDE.md                        # Guia para Claude Code ✓
├── README.md                        # Documentação do projeto ✓
└── PROJECT_STRUCTURE.md             # Este arquivo ✓
```

## Próximos Passos

1. ✅ Estrutura de pastas criada
2. ⏳ Inicializar Next.js 14 com TypeScript
3. ⏳ Configurar Tailwind CSS e shadcn/ui
4. ⏳ Configurar Supabase
5. ⏳ Implementar telas de autenticação (login/cadastro)
6. ⏳ Implementar dashboard principal
7. ⏳ Implementar demais funcionalidades

## Convenções

- **Rotas públicas**: `app/auth/*`
- **Rotas protegidas**: `app/(auth)/*`
- **Componentes UI**: `components/ui/*` (shadcn/ui)
- **Componentes de feature**: `components/{feature}/*`
- **Server Components**: Padrão no App Router
- **Client Components**: Usar diretiva "use client" quando necessário
