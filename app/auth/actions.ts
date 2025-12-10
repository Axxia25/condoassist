'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import { loginSchema, registerSchema } from '@/lib/schemas'
import type { LoginFormData, RegisterFormData } from '@/lib/schemas'

export async function loginAction(formData: LoginFormData) {
  try {
    // Validar dados
    const validatedData = loginSchema.parse(formData)

    const supabase = await createServerSupabaseClient()

    // Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      return {
        success: false,
        error: 'E-mail ou senha incorretos',
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Erro ao fazer login',
      }
    }

    // Buscar usuário no dashboard_users por auth_user_id
    let { data: dashboardUser, error: dbError } = await supabase
      .from('dashboard_users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single()

    // Se não encontrar por auth_user_id, buscar por email e vincular
    if (dbError || !dashboardUser) {
      console.log('Usuário não encontrado por auth_user_id, buscando por email...')

      const { data: userByEmail, error: emailError } = await supabase
        .from('dashboard_users')
        .select('*')
        .eq('email', validatedData.email)
        .single()

      if (emailError || !userByEmail) {
        console.error('Erro ao buscar usuário:', { dbError, emailError })
        return {
          success: false,
          error: 'Usuário não encontrado no sistema. Por favor, cadastre-se novamente.',
        }
      }

      // Vincular auth_user_id ao usuário encontrado
      const { error: updateError } = await supabase
        .from('dashboard_users')
        .update({ auth_user_id: authData.user.id })
        .eq('id', userByEmail.id)

      if (updateError) {
        console.error('Erro ao vincular auth_user_id:', updateError)
        return {
          success: false,
          error: 'Erro ao atualizar dados do usuário',
        }
      }

      dashboardUser = { ...userByEmail, auth_user_id: authData.user.id }
    }

    // Verificar se usuário está ativo
    if (!dashboardUser.ativo) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Usuário inativo. Entre em contato com o administrador.',
      }
    }

    // Atualizar último login
    await supabase
      .from('dashboard_users')
      .update({
        ultimo_login: new Date().toISOString(),
        tentativas_login: 0,
      })
      .eq('id', dashboardUser.id)

    return {
      success: true,
      user: dashboardUser,
    }
  } catch (error) {
    console.error('Erro no login:', error)
    return {
      success: false,
      error: 'Erro ao processar login',
    }
  }
}

export async function registerAction(formData: RegisterFormData) {
  try {
    // Validar dados
    const validatedData = registerSchema.parse(formData)

    const supabase = await createServerSupabaseClient()

    // Verificar se e-mail já existe
    const { data: existingUser } = await supabase
      .from('dashboard_users')
      .select('email')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return {
        success: false,
        error: 'E-mail já cadastrado',
      }
    }

    // Verificar se CPF já existe
    const { data: existingCPF } = await supabase
      .from('contatos')
      .select('cpf')
      .eq('cpf', validatedData.cpf)
      .single()

    if (existingCPF) {
      return {
        success: false,
        error: 'CPF já cadastrado',
      }
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          nome: validatedData.nome,
          sobrenome: validatedData.sobrenome,
        },
      },
    })

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Erro ao criar usuário',
      }
    }

    // Criar usuário diretamente na tabela dashboard_users
    const { error: dbError } = await supabase
      .from('dashboard_users')
      .insert({
        auth_user_id: authData.user.id,
        email: validatedData.email,
        nome: validatedData.nome,
        sobrenome: validatedData.sobrenome,
        telefone: validatedData.telefone,
        role: validatedData.role,
        condominio_id: null,
        ativo: true,
        primeiro_login: true,
      })

    if (dbError) {
      console.error('Erro ao criar usuário no banco:', dbError)
      // Se falhar ao criar no banco, remover do Auth
      await supabase.auth.admin.deleteUser(authData.user.id)
      return {
        success: false,
        error: `Erro ao criar usuário no sistema: ${dbError.message}`,
      }
    }

    return {
      success: true,
      message: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.',
    }
  } catch (error) {
    console.error('Erro no cadastro:', error)
    return {
      success: false,
      error: 'Erro ao processar cadastro',
    }
  }
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
