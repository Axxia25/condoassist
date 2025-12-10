// User Roles
export const USER_ROLES = {
  ADMIN_GERAL: 'admin_geral',
  SINDICO: 'sindico',
  OPERADOR: 'operador',
} as const

export const USER_ROLE_LABELS = {
  admin_geral: 'Administrador Geral',
  sindico: 'Síndico',
  operador: 'Operador',
} as const

// Status
export const USER_STATUS = {
  ATIVO: true,
  INATIVO: false,
} as const

// Rotas
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  CONDOMINIOS: '/condominios',
  USUARIOS: '/usuarios',
  OCORRENCIAS: '/ocorrencias',
  NPS: '/nps',
} as const

// Mensagens
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGIN_ERROR: 'E-mail ou senha incorretos',
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso!',
  REGISTER_ERROR: 'Erro ao processar cadastro',
  USER_INACTIVE: 'Usuário inativo. Entre em contato com o administrador.',
  EMAIL_EXISTS: 'E-mail já cadastrado',
  CPF_EXISTS: 'CPF já cadastrado',
} as const
