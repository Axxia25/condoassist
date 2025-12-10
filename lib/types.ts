// Database Types baseados na estrutura real do Supabase

export type UserRole = 'admin_geral' | 'sindico' | 'operador'

export interface Condominio {
  id: number
  nome: string
  codigo: string
  endereco: string | null
  total_unidades: number | null
  arquivo_convencao: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface DashboardUser {
  id: string
  auth_user_id: string | null
  email: string
  nome: string
  sobrenome: string | null
  telefone: string | null
  role: UserRole
  condominio_id: number | null
  ativo: boolean
  primeiro_login: boolean
  ultimo_login: string | null
  tentativas_login: number
  bloqueado_ate: string | null
  created_at: string
  updated_at: string
  created_by: string | null
  condominio?: Condominio
}

export interface Contato {
  id: number
  telefone: string
  nome: string | null
  cpf: string | null
  email: string | null
  condominio_id: number | null
  unidade: string | null
  tipo_contato: 'morador' | 'sindico' | 'administrador' | 'visitante' | 'outro'
  is_sindico: boolean
  total_interacoes: number
  ativo: boolean
  created_at: string
}

export interface CicloAtendimento {
  id: number
  session_id: string
  telefone: string
  contato_id: number | null
  condominio_id: number | null
  data_inicio: string
  data_fim: string | null
  total_mensagens: number
  total_buscas_rag: number
  topico_principal: string | null
  topico_id: number | null
  foi_escalado: boolean
  atendimento_satisfatorio: boolean | null
  nps_enviado: boolean
  nps_respondido: boolean
  status_ciclo: string
}

export interface Topico {
  id: number
  nome: string
  categoria: string | null
  ordem: number | null
}

export interface Ocorrencia {
  id: number
  ciclo_id: number
  contato_id: number
  condominio_id: number
  tipo: 'denuncia' | 'reclamacao' | 'sugestao'
  descricao: string
  local: string
  data_ocorrencia: string
  data_registro: string
  status: string
}

export interface NPSResposta {
  id: number
  ciclo_id: number
  contato_id: number
  condominio_id: number
  nota: number
  comentario: string | null
  data_resposta: string
  categoria_nps: string | null
}

export interface UserSession {
  id: string
  user_id: string
  login_at: string
  ip_address: string | null
  user_agent: string | null
  ativo: boolean
}

// View types
export interface AdminUserManagement extends DashboardUser {
  nome_completo: string
  role_display: string
  condominio_nome: string | null
  status_auth: string
  dias_sem_login: number | null
}

export interface AdminCondominioManagement extends Condominio {
  total_usuarios_dashboard: number
  total_contatos: number
  total_ciclos: number
  nps_medio: number | null
  ultima_atividade: string | null
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  nome: string
  sobrenome: string
  cpf: string
  password: string
  role: 'sindico' | 'admin_geral'
  telefone: string
}

export interface AuthUser {
  user: DashboardUser
  session: UserSession
}
