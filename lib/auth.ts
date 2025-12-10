import { createServerSupabaseClient } from './supabase'
import type { DashboardUser } from './types'

/**
 * Obtém o usuário autenticado do Supabase Auth e seus dados do dashboard
 * Uso: Server Components e Server Actions
 */
export async function getUser(): Promise<DashboardUser | null> {
  const supabase = await createServerSupabaseClient()

  // Verificar se há usuário autenticado
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    return null
  }

  // Buscar dados completos do usuário no dashboard_users
  const { data: dashboardUser, error: dbError } = await supabase
    .from('dashboard_users')
    .select(`
      *,
      condominio:condominios(*)
    `)
    .eq('auth_user_id', authUser.id)
    .single()

  if (dbError || !dashboardUser) {
    return null
  }

  return dashboardUser as DashboardUser
}

/**
 * Verifica se o usuário tem permissão baseado no role
 */
export async function checkPermission(allowedRoles: string[]): Promise<boolean> {
  const user = await getUser()

  if (!user) return false

  return allowedRoles.includes(user.role)
}

/**
 * Verifica se é admin geral
 */
export async function isAdminGeral(): Promise<boolean> {
  return checkPermission(['admin_geral'])
}

/**
 * Verifica se é síndico
 */
export async function isSindico(): Promise<boolean> {
  return checkPermission(['sindico'])
}

/**
 * Verifica se é operador
 */
export async function isOperador(): Promise<boolean> {
  return checkPermission(['operador'])
}

/**
 * Obtém o condomínio do usuário (se aplicável)
 */
export async function getUserCondominio(): Promise<number | null> {
  const user = await getUser()
  return user?.condominio_id || null
}
