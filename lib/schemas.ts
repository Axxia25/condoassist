import { z } from 'zod'

// Validação de CPF brasileira
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '')

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  let soma = 0
  let resto

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.substring(9, 10))) return false

  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf.substring(10, 11))) return false

  return true
}

// Schema de Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Schema de Cadastro
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .toLowerCase(),
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(200, 'Nome muito longo'),
  sobrenome: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(200, 'Sobrenome muito longo'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .transform((val) => val.replace(/[^\d]/g, ''))
    .refine((val) => val.length === 11, 'CPF deve ter 11 dígitos')
    .refine((val) => validarCPF(val), 'CPF inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha muito longa'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  role: z.enum(['sindico', 'admin_geral'], {
    required_error: 'Selecione um tipo de usuário (Síndico ou Administrador)',
  }),
  telefone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .transform((val) => val.replace(/[^\d]/g, ''))
    .refine((val) => val.length === 10 || val.length === 11, 'Telefone deve ter 10 ou 11 dígitos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>
