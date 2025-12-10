# condoassist

# 🏢 Dashboard CondoAssist v1.0

**Sistema de Gestão e Analytics para Administração de Condomínios**  
Desenvolvido por: **Fluxo TI**

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Tecnologias](#-tecnologias)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Configuração do Ambiente](#-configuração-do-ambiente)
5. [Instalação e Setup](#-instalação-e-setup)
6. [Autenticação e Permissões](#-autenticação-e-permissões)
7. [KPIs e Métricas](#-kpis-e-métricas)
8. [Funcionalidades Principais](#-funcionalidades-principais)
9. [Deploy na Vercel](#-deploy-na-vercel)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O **Dashboard CondoAssist** é uma aplicação web moderna para visualização de métricas e gestão administrativa de condomínios atendidos pelo sistema de IA CondoAssist. Oferece visão consolidada de atendimentos, satisfação de usuários, ocorrências e performance do sistema RAG.

### 🔑 Objetivos
- **Gestão Centralizada**: Visão unificada de todos os condomínios
- **Analytics Avançado**: KPIs em tempo real com filtros temporais
- **Controle de Acesso**: Níveis de permissão por usuário
- **Interface Intuitiva**: UX moderna com shadcn/ui

---

## 🚀 Tecnologias

### **Core Stack**
```typescript
Frontend:     Next.js 14 (App Router) + TypeScript
UI Library:   shadcn/ui + Tailwind CSS
Backend:      Supabase (PostgreSQL + Auth + RLS)
Deploy:       Vercel (Preview + Production)
Cache:        Next.js built-in caching + SWR
```

### **Dependências Principais**
```json
{
  "next": "14.0.0",
  "typescript": "^5.0.0",
  "react": "^18.0.0",
  "@supabase/ssr": "^0.1.0",
  "@radix-ui/react-*": "shadcn components",
  "tailwindcss": "^3.4.0",
  "recharts": "^2.8.0",
  "date-fns": "^2.30.0",
  "zod": "^3.22.0",
  "lucide-react": "^0.300.0"
}
```

---

## 📁 Estrutura do Projeto

```
condoassist-dashboard/
├── 📁 app/                     # Next.js 14 App Router
│   ├── 📁 (auth)/             # Grupo de rotas autenticadas
│   │   ├── 📁 dashboard/      # Dashboard principal
│   │   ├── 📁 condominios/    # Gestão por condomínio
│   │   ├── 📁 usuarios/       # Tabela de usuários
│   │   ├── 📁 ocorrencias/    # Gestão de ocorrências
│   │   └── 📁 nps/           # Análise de satisfação
│   ├── 📁 auth/              # Páginas de login/register
│   ├── 📁 api/               # API Routes (server actions)
│   ├── layout.tsx            # Layout raiz
│   ├── page.tsx              # Homepage (redirect)
│   └── globals.css           # Estilos globais
├── 📁 components/             # Componentes reutilizáveis
│   ├── 📁 ui/                # shadcn/ui components
│   ├── 📁 dashboard/         # Componentes específicos
│   ├── 📁 charts/            # Gráficos e visualizações
│   └── 📁 tables/            # Tabelas e filtros
├── 📁 lib/                   # Utilitários e configurações
│   ├── supabase.ts           # Cliente Supabase
│   ├── auth.ts               # Helpers de autenticação
│   ├── types.ts              # Types TypeScript
│   ├── utils.ts              # Funções utilitárias
│   └── constants.ts          # Constantes da aplicação
├── 📁 hooks/                 # Custom React Hooks
├── 📁 stores/                # Estado global (Zustand)
└── 📁 sql/                   # Migrations e Seeds
```

---

## ⚙️ Configuração do Ambiente

### **1. Variáveis de Ambiente**

Crie `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...sua-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...service-role-key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-secret-key-super-segura

# Opcional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### **2. Configuração Supabase**

#### **RLS (Row Level Security)**
```sql
-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE condominios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ciclos_atendimento ENABLE ROW LEVEL SECURITY;

-- Política para Admin Geral (acesso total)
CREATE POLICY "admin_full_access" ON condominios
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin_geral'
);

-- Política para Síndico (apenas seu condomínio)
CREATE POLICY "sindico_own_condo" ON condominios
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'sindico' AND
  id::text = auth.jwt() ->> 'condominio_id'
);
```

#### **Tabela de Usuários**
```sql
CREATE TABLE dashboard_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin_geral', 'sindico', 'operador')),
  condominio_id INTEGER REFERENCES condominios(id),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

---

## 🛠️ Instalação e Setup

### **Passo 1: Clone e Instalação**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/condoassist-dashboard.git
cd condoassist-dashboard

# Instalar dependências
npm install

# ou com yarn
yarn install
```

### **Passo 2: Setup do shadcn/ui**
```bash
# Inicializar shadcn/ui
npx shadcn-ui@latest init

# Instalar componentes essenciais
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

### **Passo 3: Configurar Banco**
```bash
# Executar migrations (opcional)
npm run db:migrate

# Fazer seed de dados iniciais
npm run db:seed
```

### **Passo 4: Executar**
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm run start
```

---

## 🔐 Autenticação e Permissões

### **Níveis de Acesso**

| Nível | Descrição | Permissões |
|-------|-----------|------------|
| **Admin Geral** | Acesso total ao sistema | Todos os condomínios + CRUD completo |
| **Síndico** | Gestor de condomínio específico | Apenas seu condomínio + CRUD limitado |
| **Operador** | Visualização e relatórios | Leitura apenas + exports |

### **Fluxo de Autenticação**
```typescript
// lib/auth.ts
export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Buscar dados completos do usuário
  const { data: profile } = await supabase
    .from('dashboard_users')
    .select('*, condominios(nome)')
    .eq('id', user.id)
    .single()
    
  return profile
}
```

---

## 📊 KPIs e Métricas

### **Dashboard Principal - Cards de KPI**

#### **1. Usuários Ativos**
```sql
-- View: vw_usuarios_unicos_periodo
SELECT COUNT(DISTINCT telefone) as usuarios_unicos
FROM ciclos_atendimento 
WHERE data_inicio >= CURRENT_DATE - INTERVAL '30 days'
```

#### **2. Parágrafos Buscados (RAG)**
```sql
-- View: vw_buscas_paragrafos_periodo  
SELECT COUNT(*) as total_paragrafos_buscados
FROM buscas_rag 
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
```

#### **3. NPS Médio**
```sql
-- View: vw_nps_geral
SELECT ROUND(AVG(nota), 2) as nps_medio
FROM nps_respostas 
WHERE data_resposta >= CURRENT_DATE - INTERVAL '30 days'
```

#### **4. Conversas com Síndicos**
```sql
-- View: vw_interacoes_sindicos
SELECT COUNT(DISTINCT ca.id) as conversas_sindicos
FROM ciclos_atendimento ca
JOIN contatos c ON ca.telefone = c.telefone
WHERE c.is_sindico = TRUE
  AND ca.data_inicio >= CURRENT_DATE - INTERVAL '30 days'
```

### **Gráficos Principais**

#### **Top 10 Tópicos Mais Buscados**
```typescript
// Componente: TopTopicsChart
const topTopics = await supabase
  .from('vw_top_topicos')
  .select('topico, total_buscas')
  .limit(10)
```

#### **Timeline de Demandas Atendidas**
```typescript
// Componente: DemandasChart  
const demandas = await supabase
  .from('vw_demandas_atendimento')
  .select('data, demandas_atendidas, demandas_nao_atendidas')
  .order('data', { ascending: false })
```

---

## 🎛️ Funcionalidades Principais

### **1. Dashboard Geral**
- **Cards de KPI** com métricas principais
- **Filtro de período** (7 dias, 30 dias, custom)
- **Seletor de condomínio** ou "Todos"
- **Gráficos interativos** (Recharts)

### **2. Gestão por Condomínio**
```typescript
// app/(auth)/condominios/[id]/page.tsx
export default async function CondomínioDetalhes({ params }) {
  const dados = await supabase
    .from('vw_dashboard_condominio')
    .select('*')
    .eq('condominio_id', params.id)
    .single()
    
  return <CondominioDashboard dados={dados} />
}
```

### **3. Tabela de Usuários**
- **Filtros múltiplos**: nome, telefone, unidade, condomínio
- **Ordenação** por colunas
- **Paginação** eficiente
- **Ações CRUD** por linha

### **4. Gestão de Ocorrências**
```typescript
// Componentes: OcorrenciasTable + OcorrenciaDialog
const ocorrencias = await supabase
  .from('ocorrencias')
  .select(`
    *,
    condominios(nome),
    contatos(nome, unidade)
  `)
  .order('data_registro', { ascending: false })
```

### **5. Análise de NPS**
- **Distribuição de notas** (1-5 estrelas)
- **Categorização**: Promotores, Neutros, Detratores  
- **Comentários** dos usuários
- **Tendências temporais**

---

## 🎨 Componentes Principais

### **Estrutura de Componentes**
```typescript
// components/dashboard/KPICard.tsx
interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon?: LucideIcon
}

// components/charts/TopicsChart.tsx
interface TopicsChartProps {
  data: Array<{ topico: string; total_buscas: number }>
  height?: number
}

// components/tables/UsuariosTable.tsx
interface UsuariosTableProps {
  usuarios: Usuario[]
  onEdit: (usuario: Usuario) => void
  onDelete: (id: string) => void
}
```

### **Layout Responsivo**
```typescript
// components/dashboard/DashboardLayout.tsx
export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r">
        <DashboardSidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <DashboardHeader />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

---

## 📱 Sidebar e Navegação

### **Menu Principal**
```typescript
const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard", 
    icon: BarChart3
  },
  {
    title: "Condomínios",
    href: "/condominios",
    icon: Building2
  },
  {
    title: "Usuários", 
    href: "/usuarios",
    icon: Users
  },
  {
    title: "Ocorrências",
    href: "/ocorrencias", 
    icon: AlertTriangle
  },
  {
    title: "NPS & Satisfação",
    href: "/nps",
    icon: ThumbsUp
  }
]
```

### **Rodapé da Sidebar**
```typescript
// components/sidebar/SidebarFooter.tsx
<div className="mt-auto p-4 border-t">
  <UserProfile user={user} />
  <SystemStatus />
  <LogoutButton />
</div>
```

---

## ☁️ Deploy na Vercel

### **1. Configuração Básica**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### **2. Variáveis de Ambiente**
```bash
# No painel da Vercel, adicionar:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=production-secret
```

### **3. Preview Deployments**
- **Automático**: Cada PR gera preview
- **Proteção**: Senha para previews
- **Teste**: Ambiente isolado para QA

### **4. Script de Deploy**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy inicial
vercel --prod

# Deploy automático via Git
git push origin main  # Auto-deploy para produção
```

---

## 🔧 Cache e Performance

### **Estratégias de Cache**
```typescript
// app/(auth)/dashboard/page.tsx
export const revalidate = 300 // 5 minutos

// lib/supabase.ts - Client-side caching
import useSWR from 'swr'

export function useKPIs(period: string) {
  return useSWR(
    `kpis-${period}`,
    () => fetchKPIs(period),
    { refreshInterval: 60000 } // 1 minuto
  )
}
```

### **Otimizações**
- **Static Generation** para páginas estáticas
- **Incremental Static Regeneration** para dados que mudam pouco
- **Client-side caching** com SWR para interações frequentes
- **Image Optimization** automática do Next.js

---

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **1. Erro de Autenticação**
```typescript
// Verificar se o usuário tem permissão
if (!user || !user.role) {
  redirect('/auth/login')
}
```

#### **2. RLS Bloqueando Queries**
```sql
-- Verificar políticas de segurança
SELECT * FROM pg_policies WHERE tablename = 'condominios';
```

#### **3. Build Errors TypeScript**
```bash
# Verificar tipos
npm run type-check

# Ignorar erros específicos (temporário)
// @ts-ignore
```

#### **4. Performance Lenta**
```sql
-- Verificar índices
EXPLAIN ANALYZE SELECT * FROM vw_dashboard_condominio;

-- Adicionar índices se necessário
CREATE INDEX idx_ciclos_periodo ON ciclos_atendimento(data_inicio);
```

---

## 🚀 Próximos Passos

### **Versão 1.1**
- [ ] Notificações push para escalamentos urgentes  
- [ ] Export para PDF/Excel
- [ ] Dashboard mobile otimizado
- [ ] Webhooks para integrações

### **Versão 1.2**
- [ ] Relatórios customizáveis
- [ ] API pública para integrações
- [ ] Auditoria de ações
- [ ] Backup automático

---

## 📞 Suporte

**Desenvolvido por**: Fluxo TI  
**Email**: contato@fluxoti.com  
**Documentação**: https://github.com/Axxia25/condoassist/edit/main/README.md
**Issues**: https://github.com/axxia25/condoassist/issues

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2025  
**License**: Proprietary - Fluxo TI
