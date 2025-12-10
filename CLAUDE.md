# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Summary

**Project**: CondoAssist Dashboard v1.0
**Status**: Phase 1 Complete (Auth + Dashboard Layout)
**Language**: All responses MUST be in Portuguese (pt-BR)
**Next Step**: Implement Phase 2 - Dashboard content with real KPIs from Supabase

**What's Done**:
- ✅ Authentication system (login/register) with Brazilian CPF validation
- ✅ Dashboard layout with collapsible sidebar, header, footer, dark/light theme
- ✅ Protected routes with authentication checks
- ✅ All placeholder pages created

**What's Next**:
- ⏳ Fetch real KPIs from Supabase views and display in dashboard
- ⏳ Implement user management CRUD
- ⏳ Build condomínios, ocorrências, and NPS modules

**Critical Files to Read First**:
- `DASHBOARD_DESIGN.md` - Complete UI/UX specification
- `app/auth/actions.ts` - Authentication logic with bug fixes
- `lib/schemas.ts` - Zod validation with CPF checker
- `components/layout/` - Dashboard layout components

## Project Overview

**CondoAssist Dashboard v1.0** - Web-based management and analytics system for condominium administration, developed by Fluxo TI. The system provides consolidated views of service tickets, user satisfaction, incidents, and RAG system performance across multiple condominiums.

**IMPORTANT**: All communication and responses must be in Portuguese (pt-BR). This includes explanations, error messages, and user-facing content.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + React 18
- **UI**: shadcn/ui + Tailwind CSS + Radix UI primitives
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Charts**: Recharts 2.8+
- **Forms**: React Hook Form + Zod validation
- **Icons**: lucide-react
- **Date handling**: date-fns
- **Deployment**: Vercel

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (Next.js 14)
npm run dev
# Server runs on http://localhost:3000

# Production build
npm run build
npm run start

# Type checking
npm run type-check

# Clear Next.js cache if needed
rm -rf .next && npm run dev

# Install shadcn/ui components
npx shadcn@latest add COMPONENT_NAME
```

## Current Implementation Status

### ✅ Phase 1 Completed
- **Authentication System**: Login and registration pages with Supabase Auth integration
  - `app/auth/login/page.tsx` - Login form with email/password
  - `app/auth/register/page.tsx` - Registration with all required fields
  - `app/auth/actions.ts` - Server Actions (loginAction, registerAction, logoutAction)
  - Fallback mechanism: searches by email if auth_user_id not found, then auto-links
- **Form Validation**: Zod schemas with Brazilian CPF validation and phone formatting (`lib/schemas.ts`)
- **UI Components**: shadcn/ui components installed:
  - button, input, label, card, form, checkbox, toast
  - dropdown-menu, separator, avatar, badge, skeleton (for dashboard layout)
- **Server Actions**: `loginAction()`, `registerAction()`, `logoutAction()` in `app/auth/actions.ts`
- **Type System**: Complete TypeScript interfaces matching Supabase database schema (`lib/types.ts`)
- **Supabase Integration**: Client and server-side clients configured (`lib/supabase.ts`)
- **Design Documentation**: Complete dashboard design spec in `DASHBOARD_DESIGN.md`

### ✅ Dashboard Layout (Phase 1) Completed
- **Theme System**: next-themes integration with dark/light mode
  - `components/layout/ThemeProvider.tsx` - Theme provider wrapper
  - `components/layout/ThemeToggle.tsx` - Sun/Moon toggle button
- **Sidebar**: Collapsible sidebar with localStorage persistence
  - `components/layout/Sidebar.tsx` - 260px expanded, 64px collapsed
  - Mobile drawer with overlay
  - Active route highlighting
  - Badge support for notifications (e.g., "12" on Ocorrências)
- **Header**: Main header with all actions
  - `components/layout/Header.tsx` - Mobile menu, notifications, theme toggle, user dropdown
  - Notifications dropdown (placeholder)
  - User profile menu with logout
- **Footer**: Simple footer with version info
  - `components/layout/Footer.tsx`
- **Dashboard Layout**: Complete wrapper component
  - `components/layout/DashboardLayout.tsx`
- **Protected Routes**: Route group with authentication check
  - `app/(auth)/layout.tsx` - Redirects to login if not authenticated
- **Placeholder Pages**: All navigation routes created
  - `/dashboard`, `/condominios`, `/usuarios`, `/ocorrencias`, `/nps`, `/configuracoes`

### ⏳ Pending (Phase 2+)
- **Dashboard Content**: Real KPIs from Supabase, Recharts graphs, functional filters
- **Breadcrumbs**: Navigation breadcrumbs in header
- **Global Search**: Search across condominiums and users
- **Real Notifications**: Fetch and display actual notifications
- **User Management**: CRUD pages for users (list, create, edit, delete)
- **Condomínios**: CRUD pages with detailed views
- **Ocorrências**: Incident management with status workflow
- **NPS Analysis**: Charts and statistics for satisfaction data

## Architecture & Key Patterns

### Authentication & Authorization (RLS-based)

The system implements three user roles with Supabase Row Level Security:

1. **admin_geral**: Full access to all condominiums and CRUD operations
2. **sindico**: Access restricted to their specific condominium (enforced via `condominio_id` in JWT claims)
3. **operador**: Read-only access for viewing and exporting reports

All authenticated routes live under `app/(auth)/` route group. Authentication helpers are in `lib/auth.ts` using Supabase SSR client (`@supabase/ssr`).

**Critical**: All database tables with sensitive data MUST have RLS enabled. Policies should check `auth.jwt() ->> 'role'` and `auth.jwt() ->> 'condominio_id'` for sindico users.

### App Router Structure (Next.js 14)

```
app/
├── (auth)/              # Protected routes - requires authentication
│   ├── dashboard/       # Main KPI dashboard with filters
│   ├── condominios/     # Per-condominium detailed views
│   │   └── [id]/       # Dynamic route for condominium details
│   ├── usuarios/        # User management table with CRUD
│   ├── ocorrencias/     # Incident management
│   └── nps/            # Satisfaction analysis (NPS metrics)
├── auth/               # Public auth pages (login/register)
├── api/                # API routes and server actions
└── layout.tsx          # Root layout with globals.css
```

### Data Fetching Pattern

Use **Server Components** by default for data fetching in Next.js 14 App Router:

```typescript
// app/(auth)/dashboard/page.tsx
export const revalidate = 300 // Cache for 5 minutes (ISR)

export default async function DashboardPage() {
  const supabase = createServerClient() // Server-side Supabase client
  const user = await getUser()

  // Fetch data server-side
  const { data } = await supabase
    .from('vw_dashboard_kpis')
    .select('*')

  return <DashboardContent data={data} />
}
```

For **client-side** real-time updates, use SWR with revalidation:

```typescript
// hooks/useKPIs.ts
import useSWR from 'swr'

export function useKPIs(period: string) {
  return useSWR(
    `kpis-${period}`,
    () => fetchKPIs(period),
    { refreshInterval: 60000 } // Refresh every minute
  )
}
```

### Database Views (Supabase PostgreSQL)

Key analytics queries are materialized as database views for performance:

- `vw_usuarios_unicos_periodo` - Unique active users count
- `vw_buscas_paragrafos_periodo` - RAG paragraph search count
- `vw_nps_geral` - Average NPS score
- `vw_interacoes_sindicos` - Conversations with síndicos
- `vw_top_topicos` - Top 10 most searched topics
- `vw_demandas_atendimento` - Timeline of attended/unattended demands
- `vw_dashboard_condominio` - Per-condominium aggregated metrics

When adding new KPIs, create materialized views in `sql/` directory and reference them in queries.

### Component Organization

```
components/
├── ui/                 # shadcn/ui primitives (button, card, table, etc.)
├── dashboard/          # Dashboard-specific components (KPICard, filters)
├── charts/            # Recharts visualizations (TopicsChart, DemandasChart)
└── tables/            # Data tables with filters (UsuariosTable, OcorrenciasTable)
```

**Pattern**: Reusable UI components go in `components/ui/`, feature-specific components go in feature folders.

### State Management

- **Server State**: Supabase + SWR for data fetching
- **Client State**: Zustand stores in `stores/` (if needed for global UI state)
- **Form State**: React Hook Form + Zod schemas in `lib/schemas.ts`

### Key Files

**Library Files:**
- `lib/supabase.ts` - Server and client Supabase client creation (`createClient()`, `createServerSupabaseClient()`)
- `lib/auth.ts` - Authentication helpers (`getUser()`, `checkPermission()`, `isAdminGeral()`, `isSindico()`)
- `lib/types.ts` - TypeScript interfaces for all database tables (DashboardUser, Condominio, etc.)
- `lib/schemas.ts` - Zod validation schemas (loginSchema, registerSchema with CPF validation)
- `lib/utils.ts` - Utility functions (`cn()` for class merging)
- `lib/constants.ts` - App-wide constants (USER_ROLES, ROUTES, MESSAGES)

**Authentication:**
- `app/auth/actions.ts` - Server Actions for login/register/logout
- `app/auth/login/page.tsx` - Login page with form
- `app/auth/register/page.tsx` - Registration page with all required fields

**Layout Components:**
- `components/layout/DashboardLayout.tsx` - Main dashboard wrapper (combines Sidebar + Header + Footer)
- `components/layout/Sidebar.tsx` - Collapsible navigation sidebar
- `components/layout/Header.tsx` - Top header with notifications, theme, user menu
- `components/layout/Footer.tsx` - Simple footer with version info
- `components/layout/ThemeProvider.tsx` - next-themes provider wrapper
- `components/layout/ThemeToggle.tsx` - Dark/light mode toggle button

**Route Groups:**
- `app/(auth)/layout.tsx` - Protected routes layout with authentication check
- `app/(auth)/dashboard/page.tsx` - Main dashboard (placeholder)
- `app/(auth)/condominios/page.tsx` - Condominiums list (placeholder)
- `app/(auth)/usuarios/page.tsx` - Users management (placeholder)
- `app/(auth)/ocorrencias/page.tsx` - Incidents list (placeholder)
- `app/(auth)/nps/page.tsx` - NPS analysis (placeholder)
- `app/(auth)/configuracoes/page.tsx` - Settings (placeholder)

**Documentation:**
- `DASHBOARD_DESIGN.md` - Complete design specification with ASCII wireframes, color palettes, and UX guidelines

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For server-side admin operations
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret
```

## Database Schema Essentials

### Core Tables

- **dashboard_users**: User profiles with role and condominio_id
- **condominios**: Condominium registry
- **contatos**: Contact information (linked to users via telefone)
- **ciclos_atendimento**: Service interaction cycles
- **ocorrencias**: Incident records
- **nps_respostas**: NPS survey responses
- **buscas_rag**: RAG search logs for analytics

### Critical Indexes

When creating new queries, ensure indexes exist on:
- `ciclos_atendimento(data_inicio)` - for date range filters
- `contatos(telefone)` - for user lookups
- `nps_respostas(data_resposta)` - for temporal analysis
- `buscas_rag(timestamp)` - for search analytics

Check query performance with `EXPLAIN ANALYZE` before deploying.

## UI/UX Standards

- **Responsive Design**: Mobile-first with Tailwind breakpoints (sm, md, lg, xl)
- **Color System**: Follow shadcn/ui theme variables in `globals.css`
- **Icons**: Use lucide-react consistently (BarChart3, Building2, Users, AlertTriangle)
- **Loading States**: Implement skeleton loaders for async data
- **Error Handling**: Use toast notifications from shadcn/ui

## Security Considerations

1. **Never expose service role key** in client-side code
2. **Always use RLS policies** - trust Supabase policies over application-level checks
3. **Validate user input** with Zod schemas before database operations
4. **Check user permissions** in Server Actions before mutations
5. **Sanitize user-generated content** before rendering (XSS prevention)

## Performance Optimization

- Use Next.js `revalidate` for ISR on dashboard pages (300s = 5 min)
- Implement pagination for large tables (usuarios, ocorrencias)
- Lazy load charts with dynamic imports if bundle size grows
- Optimize images with Next.js Image component
- Use database indexes for all filtered columns

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Automatic deployments
# Push to main branch → auto-deploy to production
# Pull requests → preview deployments
```

Set all environment variables in Vercel dashboard. Preview deployments can be password-protected for security.

## Common Patterns

### Adding a New Page

1. Create route in `app/(auth)/FEATURE/page.tsx`
2. Implement authentication check via `getUser()`
3. Add menu item in sidebar navigation (when sidebar is implemented)
4. Create reusable components in `components/FEATURE/`

### Adding a shadcn/ui Component

```bash
npx shadcn@latest add COMPONENT_NAME
```

This installs the component source in `components/ui/` for customization.

### Creating a Server Action

```typescript
'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { schema } from '@/lib/schemas'

export async function myAction(formData: FormData) {
  // 1. Validate input with Zod
  const validatedData = schema.parse(formData)

  // 2. Get authenticated user
  const user = await getUser()
  if (!user) {
    return { success: false, error: 'Não autenticado' }
  }

  // 3. Check permissions
  if (user.role !== 'admin_geral') {
    return { success: false, error: 'Sem permissão' }
  }

  // 4. Perform database operation
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('table').insert(validatedData)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
```

### Form Validation Pattern

All forms use React Hook Form + Zod:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(mySchema)
})
```

Schemas in `lib/schemas.ts` include:
- **CPF validation**: Brazilian CPF with digit verification
- **Phone formatting**: Automatic mask (XX) XXXXX-XXXX
- **Password confirmation**: Cross-field validation

## Important Implementation Notes

### Authentication Flow

1. **Registration** (`registerAction()` in `app/auth/actions.ts`):
   - Validates input with Zod schema (CPF verification, phone format, password match)
   - Checks if email or CPF already exists
   - Creates user in Supabase Auth with metadata
   - Directly inserts into `dashboard_users` table (not via RPC)
   - All fields required: nome, sobrenome, cpf, email, telefone, password, role
   - Rollback: deletes Auth user if DB insert fails

2. **Login** (`loginAction()` in `app/auth/actions.ts`):
   - Authenticates via Supabase Auth (`signInWithPassword`)
   - Fetches user from `dashboard_users` by `auth_user_id`
   - **Fallback mechanism**: If not found by `auth_user_id`, searches by email and auto-links
   - Checks if user is active (`ativo` field)
   - Updates `ultimo_login` timestamp and resets `tentativas_login`
   - Returns user data for client-side use

3. **Session Management**:
   - Sessions stored in httpOnly cookies via `@supabase/ssr`
   - Server Components use `createServerSupabaseClient()`
   - Client Components use `createClient()`
   - Protected routes via `app/(auth)/layout.tsx` with `getUser()` check

### Database Integration

The database is already configured with:
- **13 fixed topics** (Síndico x Morador, Vizinhos, etc.)
- **3 sample condominiums** (JUV, CVG, CTU)
- **RPC functions**: `admin_create_user()`, `admin_update_user()`, `admin_dashboard_stats()`
- **Views**: `vw_admin_users_management`, `vw_admin_condominios_management`

### UI Design Reference

See `DASHBOARD_DESIGN.md` for complete specifications including:
- Sidebar with collapse functionality (260px → 64px)
- Header with search, notifications, theme toggle, profile menu
- Responsive breakpoints and grid system
- Dark/light theme color palettes
- Component specifications and croquis (wireframes in ASCII art)

## Known Issues & Resolutions

### ✅ Resolved Issues

1. **Telefone not being saved to database** (Fixed in commit)
   - **Problem**: Phone number field wasn't being persisted during registration
   - **Cause**: RPC function `admin_create_user()` was not accepting or processing the telefone field
   - **Solution**: Changed registration flow to direct INSERT into `dashboard_users` table instead of using RPC
   - **Location**: `app/auth/actions.ts:163-175` (registerAction)

2. **Login failing with "Usuário não encontrado no sistema"** (Fixed in commit)
   - **Problem**: Users registered before auth_user_id linking couldn't log in
   - **Cause**: Old registration flow didn't link auth_user_id properly
   - **Solution**: Added fallback mechanism in loginAction:
     - First tries to find user by auth_user_id
     - If not found, searches by email
     - Automatically links auth_user_id and updates the record
   - **Location**: `app/auth/actions.ts:42-75` (loginAction)

3. **toaster.tsx import error** (Fixed in commit)
   - **Problem**: `Can't resolve '@/components/hooks/use-toast'`
   - **Cause**: Wrong import path in auto-generated toaster.tsx from shadcn/ui
   - **Solution**: Changed import to `@/hooks/use-toast`
   - **Recovery**: Had to clear Next.js cache: `rm -rf .next && npm run dev`

### Current Limitations

- **Notifications**: Currently showing placeholder data (hardcoded "3" badge)
- **Dashboard KPIs**: Placeholder content, not fetching from Supabase views
- **User Avatar**: Using initials only, no image upload
- **Breadcrumbs**: Not yet implemented
- **Global Search**: Not yet functional
- **Real-time Updates**: Not using Supabase Realtime subscriptions yet

## Troubleshooting Guide

### Cache Issues

If you see unexpected behavior or stale data:
```bash
# Clear Next.js cache and restart dev server
rm -rf .next && npm run dev

# Clear node_modules if needed
rm -rf node_modules && npm install
```

### Supabase Connection Issues

If getting auth errors:
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is active and not paused
3. Check RLS policies are not blocking requests
4. Verify `auth_user_id` column exists in `dashboard_users` table

### TypeScript Errors

If seeing type mismatches:
```bash
# Run type checker
npm run type-check

# Check if types in lib/types.ts match database schema
```

### Build Errors

If production build fails:
```bash
# Check for unused imports
npm run lint

# Verify all environment variables are set
# Check next.config.js for any issues
```

## Next Steps (Phase 2+)

### Immediate Priorities

1. **Dashboard Content Implementation**
   - Fetch real KPIs from Supabase views (`vw_usuarios_unicos_periodo`, `vw_nps_geral`, etc.)
   - Implement Recharts visualizations
   - Add date range filters (hoje, semana, mês, trimestre, ano, personalizado)
   - Create KPICard component for reusable metric display

2. **User Management (CRUD)**
   - List all users from `dashboard_users` table
   - Create new users (admin_geral only)
   - Edit user details (role, condominio assignment, active status)
   - Delete/deactivate users
   - Implement role-based permissions checks

3. **Condomínios Module**
   - List view with search and filters
   - Detailed view per condominium (`/condominios/[id]`)
   - Display condominium-specific KPIs using `vw_dashboard_condominio`
   - CRUD operations for admin_geral

4. **Real Notifications**
   - Create notifications table in database
   - Fetch unread notifications count
   - Display recent notifications in dropdown
   - Mark as read functionality
   - (Optional) Supabase Realtime for live updates

5. **Ocorrências Management**
   - List incidents with filters (status, type, date)
   - Create new incident form
   - Status workflow (pendente → em_andamento → resolvida)
   - Comments/notes on incidents

### UI/UX Enhancements

- **Breadcrumbs**: Add navigation breadcrumbs in header (Dashboard > Condomínios > [Nome])
- **Global Search**: Cmd+K command palette for quick navigation
- **Loading States**: Implement skeleton loaders for all async content
- **Error Boundaries**: Add React error boundaries for graceful failures
- **Empty States**: Design empty state UIs for tables/lists with no data

### Performance Optimizations

- Implement pagination for large tables (10, 25, 50, 100 rows per page)
- Add database indexes for frequently filtered columns
- Use Next.js ISR (revalidate) for dashboard pages
- Lazy load charts with React.lazy() if bundle size grows
- Optimize images with next/image component

### Code Quality

- Add JSDoc comments to all Server Actions
- Document complex business logic in comments
- Create reusable hooks for data fetching (`useKPIs`, `useCondominios`, etc.)
- Extract magic numbers/strings to constants

## Development Best Practices

### When Adding New Features

1. **Always read existing code first** - Never propose changes without reading relevant files
2. **Follow existing patterns** - Use the same structure as similar features
3. **Validate user input** - Always use Zod schemas for forms
4. **Check permissions** - Verify user role before mutations
5. **Handle errors gracefully** - Return user-friendly error messages
6. **Test authentication** - Ensure protected routes redirect properly

### Code Style Guidelines

- **Use Server Components by default** - Only use 'use client' when necessary
- **Keep components small** - Extract reusable pieces to separate files
- **TypeScript strict mode** - Always type function parameters and returns
- **Consistent naming**:
  - Components: PascalCase (UserTable.tsx)
  - Utilities: camelCase (formatCPF)
  - Constants: UPPER_SNAKE_CASE (USER_ROLES)
- **Imports order**: React → Next.js → Third-party → Local components → Utils/Types

### Portuguese Language Requirements

- **All user-facing text**: Portuguese (pt-BR)
- **Code comments**: Portuguese preferred
- **Variable/function names**: English (standard practice)
- **Error messages**: Portuguese with helpful context
- **Validation messages**: Portuguese (see lib/schemas.ts for examples)

### Security Checklist

- [ ] Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- [ ] Always validate input with Zod before database operations
- [ ] Check user permissions in Server Actions (never trust client)
- [ ] Use RLS policies as primary security layer
- [ ] Sanitize user content before rendering (prevent XSS)
- [ ] Use httpOnly cookies for session management (handled by @supabase/ssr)
- [ ] Implement CSRF protection for mutations (Next.js handles this)

## Testing Strategy

While not yet implemented, future test structure should follow:
- **Unit tests**: `__tests__/` alongside component files
- **Integration tests**: API routes and database queries
- **E2E tests**: Critical user flows (Playwright/Cypress)

## Implementation History & Technical Decisions

### Phase 1: Project Setup & Authentication (Completed)

**Decisions Made**:
1. **Next.js 14 App Router** instead of Pages Router
   - Reason: Server Components by default, better performance, modern patterns
   - Trade-off: Smaller ecosystem compared to Pages Router

2. **shadcn/ui** instead of Material-UI or Chakra UI
   - Reason: Copy-paste components (no package dependency), full customization
   - Trade-off: Need to manually install each component

3. **Supabase** instead of custom backend
   - Reason: Built-in auth, RLS, real-time capabilities, hosted PostgreSQL
   - Trade-off: Vendor lock-in, but easier to maintain

4. **Direct database INSERT** instead of RPC for user creation
   - Reason: RPC function `admin_create_user()` was not working with telefone field
   - Implemented: Rollback mechanism (delete Auth user if DB insert fails)
   - Location: `app/auth/actions.ts:163-185`

5. **Fallback email search** in login flow
   - Reason: Handle legacy users without auth_user_id link
   - Implemented: Auto-linking mechanism to fix data on-the-fly
   - Location: `app/auth/actions.ts:42-75`

6. **localStorage for sidebar state** instead of database
   - Reason: UI preference, no need for server sync
   - Trade-off: State lost on different device/browser

7. **Route groups `(auth)` and `auth`** for organization
   - `app/(auth)/` - Protected routes requiring authentication
   - `app/auth/` - Public authentication pages (login, register)
   - Reason: Clean URL structure, shared layouts

### Phase 1: Dashboard Layout (Completed)

**Decisions Made**:
1. **next-themes** for theme management
   - Reason: SSR-safe, system preference detection, localStorage persistence
   - Alternatives considered: Custom context (more complexity)

2. **Collapsible sidebar: 260px → 64px**
   - Reason: Balance between information density and screen space
   - Mobile: Full drawer with overlay (not collapsed)

3. **Sticky header with backdrop blur**
   - Reason: Modern aesthetic, maintains context while scrolling
   - CSS: `bg-background/95 backdrop-blur`

4. **Component structure: DashboardLayout wraps Sidebar + Header + Footer**
   - Reason: Single source of truth, easier to maintain
   - Server Component for auth check in layout.tsx

**Design Decisions** (see DASHBOARD_DESIGN.md for details):
- Desktop: Sidebar always visible, collapsible
- Tablet (768px-1024px): Sidebar starts collapsed
- Mobile (<768px): Drawer with hamburger menu
- Theme toggle: Header (desktop/tablet), Sidebar (mobile)

### Lessons Learned

1. **Always validate shadcn/ui paths after installation**
   - The toaster.tsx import error taught us to verify paths
   - Solution: Read the generated file and fix if needed

2. **RPC functions may have limitations**
   - The telefone field not working with `admin_create_user()` RPC
   - Solution: Direct table access when RPC is unreliable

3. **Authentication requires fallback mechanisms**
   - Legacy data or migration issues can break login
   - Solution: Multi-step fallback (auth_user_id → email search → auto-link)

4. **Cache clearing is sometimes necessary**
   - Next.js caches compiled code in `.next/`
   - Solution: `rm -rf .next && npm run dev` when seeing stale imports

5. **Design documentation before implementation saves time**
   - Creating DASHBOARD_DESIGN.md with wireframes prevented rework
   - Having color palettes and breakpoints documented upfront was valuable

---

**Last Updated**: 2025-12-10
**Version**: 1.0.0 (Phase 1 Complete)
**Contributors**: Fluxo TI + Claude Code
