# 🎨 Manual de Design - CondoAssist Dashboard

> **Versão:** 1.0
> **Data:** Dezembro 2024
> **Status:** Especificação Completa

---

## 📐 Índice

1. [Visão Geral do Layout](#visão-geral-do-layout)
2. [Estrutura de Componentes](#estrutura-de-componentes)
3. [Croquis e Wireframes](#croquis-e-wireframes)
4. [Sidebar - Especificações](#sidebar---especificações)
5. [Header - Especificações](#header---especificações)
6. [Footer - Especificações](#footer---especificações)
7. [Área de Conteúdo](#área-de-conteúdo)
8. [Sistema de Temas (Dark/Light)](#sistema-de-temas-darklight)
9. [Responsividade](#responsividade)
10. [Navegação e Fluxos](#navegação-e-fluxos)
11. [Boas Práticas de UX](#boas-práticas-de-ux)
12. [Componentes Reutilizáveis](#componentes-reutilizáveis)

---

## 🎯 Visão Geral do Layout

### Arquitetura Principal

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Fixo no topo)                                      │
│  [Logo] [Breadcrumb]    [Search] [Notif] [Theme] [Profile] │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ SIDEBAR  │  MAIN CONTENT                                   │
│ (Colap-  │  ┌────────────────────────────────────┐        │
│  sável)  │  │  Page Title & Actions              │        │
│          │  ├────────────────────────────────────┤        │
│ [Home]   │  │                                    │        │
│ [Condo]  │  │  KPIs Cards (Grid 1-4 colunas)    │        │
│ [Users]  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │        │
│ [Ocorr]  │  │  │ XX │ │ XX │ │ XX │ │ XX │     │        │
│ [NPS]    │  │  └────┘ └────┘ └────┘ └────┘     │        │
│          │  │                                    │        │
│          │  ├────────────────────────────────────┤        │
│          │  │  Charts & Tables                   │        │
│          │  │  ┌──────────┐  ┌──────────┐       │        │
│          │  │  │ Chart 1  │  │ Chart 2  │       │        │
│          │  │  └──────────┘  └──────────┘       │        │
│          │  │                                    │        │
│          │  │  ┌───────────────────────────┐    │        │
│          │  │  │ Data Table                │    │        │
│          │  │  └───────────────────────────┘    │        │
│          │  │                                    │        │
│          │  └────────────────────────────────────┘        │
│          │                                                  │
├──────────┴──────────────────────────────────────────────────┤
│  FOOTER (Fixo no rodapé)                                    │
│  © Fluxo TI | Versão 1.0 | Última atualização: XX/XX/XXXX  │
└─────────────────────────────────────────────────────────────┘
```

### Medidas e Proporções

| Elemento | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| **Header** | 64px altura | 60px | 56px |
| **Sidebar (Expandida)** | 260px largura | 240px | Full width (drawer) |
| **Sidebar (Colapsada)** | 64px largura | 60px | Hidden |
| **Footer** | 48px altura | 48px | 56px |
| **Container Max Width** | 1400px | 100% | 100% |
| **Padding Lateral** | 24px | 20px | 16px |

---

## 🏗️ Estrutura de Componentes

### Hierarquia de Arquivos

```
app/
├── (auth)/
│   ├── layout.tsx                    # Layout autenticado (com sidebar)
│   ├── dashboard/
│   │   └── page.tsx                  # Dashboard principal
│   ├── condominios/
│   │   ├── page.tsx                  # Lista de condomínios
│   │   └── [id]/
│   │       └── page.tsx              # Detalhes do condomínio
│   ├── usuarios/
│   │   └── page.tsx                  # Gerenciamento de usuários
│   ├── ocorrencias/
│   │   └── page.tsx                  # Gestão de ocorrências
│   └── nps/
│       └── page.tsx                  # Análise de NPS

components/
├── layout/
│   ├── DashboardLayout.tsx           # Layout completo (Header + Sidebar + Footer)
│   ├── Header.tsx                    # Header principal
│   ├── Sidebar.tsx                   # Sidebar com navegação
│   ├── Footer.tsx                    # Footer
│   └── ThemeToggle.tsx               # Toggle dark/light
├── dashboard/
│   ├── KPICard.tsx                   # Card de KPI
│   ├── StatsCard.tsx                 # Card de estatísticas
│   ├── FilterBar.tsx                 # Barra de filtros
│   └── PageHeader.tsx                # Cabeçalho de página
├── charts/
│   ├── TopTopicsChart.tsx            # Gráfico de tópicos
│   ├── DemandasChart.tsx             # Gráfico de demandas
│   └── NPSChart.tsx                  # Gráfico de NPS
└── tables/
    ├── DataTable.tsx                 # Tabela genérica reutilizável
    ├── UsuariosTable.tsx             # Tabela de usuários
    └── OcorrenciasTable.tsx          # Tabela de ocorrências
```

---

## 📱 Croquis e Wireframes

### Layout Desktop (> 1024px)

```
╔═══════════════════════════════════════════════════════════════════════╗
║  🏢 CondoAssist    Home > Dashboard        🔍 [Search]  🔔 🌙 👤      ║
╠═══════════╦═══════════════════════════════════════════════════════════╣
║           ║  📊 Dashboard Principal              [Filtros] [Export]   ║
║  🏠 Home  ║  ┌─────────────────────────────────────────────────────┐  ║
║           ║  │  Período: [Últimos 30 dias ▼]  Condomínio: [Todos] │  ║
║  🏢 Cond  ║  └─────────────────────────────────────────────────────┘  ║
║  ominios  ║                                                            ║
║           ║  ┏━━━━━━━┓  ┏━━━━━━━┓  ┏━━━━━━━┓  ┏━━━━━━━┓            ║
║  👥 Usuá  ║  ┃ 1,234 ┃  ┃  456  ┃  ┃  4.2  ┃  ┃   89  ┃            ║
║  rios     ║  ┃Users  ┃  ┃Buscas ┃  ┃ NPS   ┃  ┃Síndic ┃            ║
║           ║  ┗━━━━━━━┛  ┗━━━━━━━┛  ┗━━━━━━━┛  ┗━━━━━━━┛            ║
║  ⚠️ Ocorr ║  ↑ 12%      ↑ 23%      ↑ 0.3     ↓ 5%                   ║
║  ências   ║                                                            ║
║           ║  ┌────────────────────────┐  ┌────────────────────────┐  ║
║  ⭐ NPS & ║  │ Top 10 Tópicos         │  │ Demandas Atendidas     │  ║
║  Satisfa  ║  │ ┌────────────────────┐ │  │ ┌────────────────────┐ │  ║
║  ção      ║  │ │ Síndico x Morador █│ │  │ │    ╱╲    ╱╲         │ │  ║
║           ║  │ │ Vizinhos         ██│ │  │ │   ╱  ╲  ╱  ╲  ╱╲    │ │  ║
║           ║  │ │ Áreas Comuns    ███│ │  │ │  ╱    ╲╱    ╲╱  ╲   │ │  ║
║           ║  │ └────────────────────┘ │  │ └────────────────────┘ │  ║
║  [⚙️ Conf]║  └────────────────────────┘  └────────────────────────┘  ║
║           ║                                                            ║
║  [🚪 Sair]║  ┌──────────────────────────────────────────────────────┐║
║           ║  │ 📋 Últimas Interações                   [Ver Todas] │║
║           ║  ├──────────────────────────────────────────────────────┤║
║           ║  │ ○ João Silva - Condomínio JUV - Há 5 min           │║
║           ║  │ ○ Maria Santos - Condomínio CVG - Há 12 min        │║
║           ║  └──────────────────────────────────────────────────────┘║
╠═══════════╩═══════════════════════════════════════════════════════════╣
║  © 2024 Fluxo TI | v1.0.0 | Última atualização: 09/12/2024 18:30     ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Layout Mobile (< 768px)

```
╔═══════════════════════════════════╗
║ ☰  CondoAssist        🔔 🌙 👤  ║
╠═══════════════════════════════════╣
║                                   ║
║  📊 Dashboard                     ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║                                   ║
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ║
║  ┃        1,234               ┃  ║
║  ┃    Usuários Ativos         ┃  ║
║  ┃        ↑ 12%              ┃  ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ║
║                                   ║
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ║
║  ┃         456                ┃  ║
║  ┃    Buscas RAG              ┃  ║
║  ┃        ↑ 23%              ┃  ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ║
║                                   ║
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ║
║  ┃         4.2                ┃  ║
║  ┃      NPS Médio             ┃  ║
║  ┃        ↑ 0.3              ┃  ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛  ║
║                                   ║
║  [Ver Gráficos Completos]         ║
║                                   ║
╠═══════════════════════════════════╣
║  © Fluxo TI | v1.0.0              ║
╚═══════════════════════════════════╝
```

---

## 🗂️ Sidebar - Especificações

### Estados da Sidebar

#### 1. Expandida (Desktop)
```
┌─────────────────────────┐
│  🏢 CondoAssist         │
│  ━━━━━━━━━━━━━━━━━━━━ │
│                         │
│  🏠 Dashboard           │ ← Ativo (bg-primary)
│                         │
│  🏢 Condomínios         │
│                         │
│  👥 Usuários            │
│                         │
│  ⚠️  Ocorrências        │
│                         │
│  ⭐ NPS & Satisfação    │
│                         │
│  ━━━━━━━━━━━━━━━━━━━━ │
│                         │
│  ⚙️  Configurações      │
│                         │
│  🚪 Sair                │
│                         │
│  [João Silva]           │ ← User info
│  Admin Geral            │
│  [◀️  Collapse]         │ ← Botão collapse
└─────────────────────────┘
```

#### 2. Colapsada (Desktop)
```
┌────┐
│ 🏢 │
├────┤
│ 🏠 │ ← Ativo
│ 🏢 │
│ 👥 │
│ ⚠️ │
│ ⭐ │
├────┤
│ ⚙️ │
│ 🚪 │
├────┤
│ 👤 │
│ ▶️ │ ← Expand
└────┘
```

#### 3. Drawer (Mobile)
- Aparece sobrepondo o conteúdo
- Backdrop escuro com opacidade
- Swipe para fechar
- Mesma estrutura da versão expandida

### Comportamento

| Ação | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| **Inicial** | Expandida | Expandida | Oculta |
| **Collapse** | Mantém colapsada (localStorage) | Drawer | Drawer |
| **Hover (colapsada)** | Tooltip com nome | - | - |
| **Clique fora** | - | Fecha drawer | Fecha drawer |

### Itens de Menu

```typescript
const menuItems = [
  {
    section: "principal",
    items: [
      { icon: BarChart3, label: "Dashboard", href: "/dashboard", badge: null },
      { icon: Building2, label: "Condomínios", href: "/condominios", badge: "3" },
      { icon: Users, label: "Usuários", href: "/usuarios", badge: null },
      { icon: AlertTriangle, label: "Ocorrências", href: "/ocorrencias", badge: "12" },
      { icon: ThumbsUp, label: "NPS & Satisfação", href: "/nps", badge: null },
    ]
  },
  {
    section: "configurações",
    items: [
      { icon: Settings, label: "Configurações", href: "/configuracoes", badge: null },
      { icon: LogOut, label: "Sair", href: "/auth/logout", badge: null },
    ]
  }
]
```

---

## 📊 Header - Especificações

### Estrutura Completa

```
┌────────────────────────────────────────────────────────────────────┐
│  [☰] 🏢 CondoAssist    Home > Dashboard > KPIs                    │
│                                                                    │
│              [🔍 Buscar...]  [🔔 3] [🌙/☀️] [👤 João Silva ▼]   │
└────────────────────────────────────────────────────────────────────┘
```

### Componentes do Header

#### 1. **Logo e Breadcrumb** (Esquerda)
- **Mobile:** Menu hamburguer + Logo
- **Desktop:** Logo + Breadcrumb completo

#### 2. **Busca Global** (Centro)
- Atalho: `Ctrl+K` / `Cmd+K`
- Busca em: Condomínios, Usuários, Ocorrências
- Resultados com preview
- Navegação por teclado

#### 3. **Actions** (Direita)
```
┌──────────────────────────────┐
│  [🔔 Badge:3]                │
│  [🌙 Theme]                  │
│  [👤 Profile Menu ▼]         │
└──────────────────────────────┘
```

### Dropdown do Perfil

```
┌─────────────────────────────┐
│  👤 João Silva              │
│  ✉️  joao@email.com         │
│  🏷️  Admin Geral            │
├─────────────────────────────┤
│  👤 Meu Perfil              │
│  ⚙️  Configurações          │
│  ❓ Ajuda                   │
├─────────────────────────────┤
│  🚪 Sair                    │
└─────────────────────────────┘
```

### Dropdown de Notificações

```
┌────────────────────────────────────┐
│  🔔 Notificações         [Ver tudo]│
├────────────────────────────────────┤
│  ⚠️  Nova ocorrência - Cond. JUV  │
│      Há 5 minutos                  │
├────────────────────────────────────┤
│  ⭐ NPS Recebido - Maria Santos   │
│      Há 12 minutos                 │
├────────────────────────────────────┤
│  👥 Novo usuário cadastrado       │
│      Há 1 hora                     │
└────────────────────────────────────┘
```

---

## 🦶 Footer - Especificações

### Layout Desktop
```
┌────────────────────────────────────────────────────────────────┐
│  © 2024 Fluxo TI  |  v1.0.0  |  Última atualização: 09/12/24  │
│  [Documentação]  [Suporte]  [Política de Privacidade]         │
└────────────────────────────────────────────────────────────────┘
```

### Layout Mobile
```
┌──────────────────────────┐
│  © 2024 Fluxo TI         │
│  v1.0.0                  │
│  [Docs] [Suporte] [PP]   │
└──────────────────────────┘
```

### Informações Dinâmicas

- **Versão:** Atualizada automaticamente do `package.json`
- **Última atualização:** Timestamp do último deploy
- **Status do sistema:** Indicador verde/amarelo/vermelho

---

## 📄 Área de Conteúdo

### Padrão de Página

```typescript
// Estrutura padrão de qualquer página
<PageLayout>
  <PageHeader
    title="Título da Página"
    subtitle="Descrição breve"
    actions={[
      <Button>Exportar</Button>,
      <Button variant="primary">Nova Ação</Button>
    ]}
    breadcrumb={["Home", "Seção", "Página Atual"]}
  />

  <FilterBar
    filters={[
      { type: 'date', label: 'Período' },
      { type: 'select', label: 'Condomínio', options: [...] },
      { type: 'search', placeholder: 'Buscar...' }
    ]}
  />

  <ContentGrid>
    {/* KPIs, Charts, Tables */}
  </ContentGrid>
</PageLayout>
```

### Grid Responsivo

```css
/* Desktop: 4 colunas */
grid-template-columns: repeat(4, 1fr);

/* Tablet: 2 colunas */
@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Mobile: 1 coluna */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

---

## 🎨 Sistema de Temas (Dark/Light)

### Paleta de Cores

#### Light Theme
```css
:root {
  --background: 0 0% 100%;           /* Branco puro */
  --foreground: 222 84% 5%;          /* Texto escuro */

  --primary: 222 47% 11%;            /* Azul escuro */
  --primary-foreground: 210 40% 98%; /* Branco */

  --secondary: 210 40% 96%;          /* Cinza claro */
  --secondary-foreground: 222 47% 11%;

  --muted: 210 40% 96%;              /* Backgrounds sutis */
  --muted-foreground: 215 16% 47%;   /* Texto secundário */

  --accent: 210 40% 96%;             /* Highlights */
  --accent-foreground: 222 47% 11%;

  --destructive: 0 84% 60%;          /* Vermelho */
  --destructive-foreground: 210 40% 98%;

  --border: 214 32% 91%;             /* Bordas */
  --input: 214 32% 91%;
  --ring: 222 84% 5%;

  --success: 142 76% 36%;            /* Verde */
  --warning: 38 92% 50%;             /* Amarelo */
  --info: 199 89% 48%;               /* Azul claro */
}
```

#### Dark Theme
```css
.dark {
  --background: 222 84% 5%;          /* Cinza muito escuro */
  --foreground: 210 40% 98%;         /* Texto claro */

  --primary: 210 40% 98%;            /* Branco/Azul claro */
  --primary-foreground: 222 47% 11%; /* Escuro */

  --secondary: 217 33% 17%;          /* Cinza escuro */
  --secondary-foreground: 210 40% 98%;

  --muted: 217 33% 17%;              /* Backgrounds sutis */
  --muted-foreground: 215 20% 65%;   /* Texto secundário */

  --accent: 217 33% 17%;             /* Highlights */
  --accent-foreground: 210 40% 98%;

  --destructive: 0 63% 31%;          /* Vermelho escuro */
  --destructive-foreground: 210 40% 98%;

  --border: 217 33% 17%;             /* Bordas */
  --input: 217 33% 17%;
  --ring: 213 27% 84%;

  --success: 142 76% 36%;            /* Verde */
  --warning: 38 92% 50%;             /* Amarelo */
  --info: 199 89% 48%;               /* Azul claro */
}
```

### Toggle de Tema

```
┌────────────────────┐
│  Tema              │
├────────────────────┤
│  ○ Claro           │
│  ● Escuro          │
│  ○ Sistema         │
└────────────────────┘
```

- Salvo em `localStorage`
- Respeita preferência do sistema
- Transição suave (300ms)

---

## 📱 Responsividade

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile grande
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop pequeno
  xl: '1280px',  // Desktop
  '2xl': '1400px' // Desktop grande
}
```

### Comportamentos por Dispositivo

| Componente | Mobile (<768px) | Tablet (768-1024px) | Desktop (>1024px) |
|------------|-----------------|---------------------|-------------------|
| **Sidebar** | Drawer (oculta) | Drawer/Colapsada | Expandida/Colapsada |
| **Header** | Compacto (56px) | Normal (60px) | Normal (64px) |
| **KPI Cards** | 1 coluna | 2 colunas | 4 colunas |
| **Charts** | Stack vertical | 2 colunas | 2-3 colunas |
| **Tables** | Scroll horizontal | Normal | Normal |
| **Modals** | Full screen | Centralizado | Centralizado |

### Testes de Responsividade

✅ **Obrigatório testar em:**
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop HD (1920px)

---

## 🧭 Navegação e Fluxos

### Mapa de Navegação

```
Login/Register
    │
    ├─> Dashboard Principal (/)
    │   ├─> Filtros de período
    │   ├─> Filtros de condomínio
    │   └─> Visualização de KPIs
    │
    ├─> Condomínios (/condominios)
    │   ├─> Lista de condomínios
    │   ├─> Criar novo condomínio
    │   └─> Detalhes do condomínio (/condominios/[id])
    │       ├─> Editar condomínio
    │       ├─> Ver usuários
    │       └─> Ver estatísticas
    │
    ├─> Usuários (/usuarios)
    │   ├─> Lista de usuários
    │   ├─> Filtros (role, condomínio, status)
    │   ├─> Criar usuário
    │   ├─> Editar usuário
    │   └─> Desativar/Ativar usuário
    │
    ├─> Ocorrências (/ocorrencias)
    │   ├─> Lista de ocorrências
    │   ├─> Filtros (tipo, status, data)
    │   ├─> Nova ocorrência
    │   ├─> Detalhes da ocorrência
    │   └─> Atualizar status
    │
    ├─> NPS & Satisfação (/nps)
    │   ├─> Dashboard de NPS
    │   ├─> Distribuição de notas
    │   ├─> Comentários
    │   └─> Tendências
    │
    └─> Configurações (/configuracoes)
        ├─> Perfil do usuário
        ├─> Preferências
        ├─> Segurança
        └─> Tema
```

### Fluxos de Permissão

#### Admin Geral
```
✅ Dashboard completo (todos os condomínios)
✅ CRUD completo de usuários
✅ CRUD completo de condomínios
✅ Visualizar todas ocorrências
✅ Exportar dados
✅ Configurações do sistema
```

#### Síndico
```
✅ Dashboard filtrado (seu condomínio)
✅ Visualizar usuários do seu condomínio
❌ Criar/editar usuários
✅ Visualizar ocorrências do seu condomínio
✅ Criar ocorrências
✅ Exportar dados do seu condomínio
❌ Configurações do sistema
```

#### Operador
```
✅ Dashboard filtrado (seu condomínio)
✅ Visualizar usuários do seu condomínio
❌ Criar/editar usuários
✅ Visualizar ocorrências
❌ Criar/editar ocorrências
✅ Exportar relatórios
❌ Configurações
```

---

## ✨ Boas Práticas de UX

### 1. **Loading States**
```typescript
// Skeleton loading para cards
<Skeleton className="h-32 w-full" />

// Spinner para ações
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Carregando...
</Button>

// Progress bar para uploads
<Progress value={uploadProgress} />
```

### 2. **Empty States**
```
┌────────────────────────────┐
│                            │
│      📭                    │
│                            │
│  Nenhum dado encontrado    │
│                            │
│  Tente ajustar os filtros  │
│  ou adicionar novos dados  │
│                            │
│  [+ Adicionar Novo]        │
│                            │
└────────────────────────────┘
```

### 3. **Error States**
```
┌────────────────────────────┐
│      ⚠️                     │
│                            │
│  Erro ao carregar dados    │
│                            │
│  [Tentar Novamente]        │
│                            │
└────────────────────────────┘
```

### 4. **Feedback Visual**

| Ação | Feedback |
|------|----------|
| **Sucesso** | Toast verde + Ícone ✓ |
| **Erro** | Toast vermelho + Ícone ✗ |
| **Aviso** | Toast amarelo + Ícone ⚠️ |
| **Info** | Toast azul + Ícone ℹ️ |

### 5. **Confirmações Críticas**
```
┌───────────────────────────────┐
│  ⚠️  Confirmar Exclusão       │
├───────────────────────────────┤
│  Tem certeza que deseja       │
│  excluir este usuário?        │
│                               │
│  Esta ação não pode ser       │
│  desfeita.                    │
│                               │
│  [Cancelar] [Excluir]         │
└───────────────────────────────┘
```

### 6. **Acessibilidade**

✅ **Checklist:**
- [ ] Navegação por teclado (Tab, Enter, Esc)
- [ ] ARIA labels em todos os componentes
- [ ] Contraste mínimo 4.5:1 (WCAG AA)
- [ ] Focus visible em elementos interativos
- [ ] Alt text em imagens
- [ ] Roles semânticos (nav, main, aside)
- [ ] Screen reader friendly

### 7. **Performance**

✅ **Otimizações:**
- Lazy loading de rotas
- Virtualização de tabelas longas
- Debounce em buscas (300ms)
- Cache de dados com SWR
- Paginação server-side
- Compressão de imagens

---

## 🧩 Componentes Reutilizáveis

### KPI Card
```typescript
<KPICard
  title="Usuários Ativos"
  value="1,234"
  change={12}
  trend="up"
  icon={Users}
  period="últimos 30 dias"
/>
```

### Stats Card
```typescript
<StatsCard
  title="NPS Médio"
  value={4.2}
  max={5}
  format="decimal"
  chart={<MiniLineChart data={[...]} />}
/>
```

### Data Table
```typescript
<DataTable
  columns={columns}
  data={data}
  pageSize={10}
  searchable
  sortable
  filterable
  exportable
/>
```

### Filter Bar
```typescript
<FilterBar
  filters={[
    { type: 'dateRange', name: 'period' },
    { type: 'select', name: 'condominio', options: condominios },
    { type: 'multiSelect', name: 'status', options: statusOptions }
  ]}
  onFilterChange={handleFilterChange}
/>
```

### Page Header
```typescript
<PageHeader
  title="Gerenciamento de Usuários"
  subtitle="Visualize e gerencie todos os usuários do sistema"
  breadcrumb={["Home", "Usuários"]}
  actions={
    <>
      <Button variant="outline">Exportar</Button>
      <Button>+ Novo Usuário</Button>
    </>
  }
/>
```

---

## 📋 Checklist de Implementação

### Fase 1: Estrutura Base
- [ ] Criar DashboardLayout component
- [ ] Implementar Sidebar (expandida/colapsada)
- [ ] Implementar Header
- [ ] Implementar Footer
- [ ] Sistema de tema (dark/light)
- [ ] Navegação entre páginas

### Fase 2: Dashboard Principal
- [ ] KPI Cards (4 principais)
- [ ] Gráficos de tópicos
- [ ] Gráficos de demandas
- [ ] Tabela de últimas interações
- [ ] Filtros de período e condomínio

### Fase 3: Páginas Secundárias
- [ ] Página de Condomínios
- [ ] Página de Usuários
- [ ] Página de Ocorrências
- [ ] Página de NPS

### Fase 4: Responsividade
- [ ] Testar em todos os breakpoints
- [ ] Drawer mobile para sidebar
- [ ] Ajustar grids e layouts
- [ ] Otimizar tabelas para mobile

### Fase 5: Polimento
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Animações e transições
- [ ] Acessibilidade
- [ ] Testes de performance

---

## 🎯 Conclusão

Este manual serve como guia completo para a implementação do dashboard. Todos os componentes, layouts e fluxos estão especificados para garantir:

✅ **Consistência visual** em todas as páginas
✅ **Experiência responsiva** em todos os dispositivos
✅ **Navegação intuitiva** e clara
✅ **Acessibilidade** para todos os usuários
✅ **Performance otimizada**

**Próximos passos:** Revisar este documento e iniciar a implementação seguindo as especificações.

---

**Desenvolvido por:** Fluxo TI
**Versão do documento:** 1.0
**Data:** Dezembro 2024
