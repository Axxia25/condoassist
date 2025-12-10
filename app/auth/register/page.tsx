'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'

import { registerSchema, type RegisterFormData } from '@/lib/schemas'
import { registerAction } from '../actions'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'sindico' | 'admin_geral' | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  function handleRoleChange(role: 'sindico' | 'admin_geral') {
    setSelectedRole(role)
    setValue('role', role)
  }

  function formatCPF(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  async function onSubmit(data: RegisterFormData) {
    if (!selectedRole) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione o tipo de usuário (Síndico ou Administrador)',
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await registerAction(data)

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: result.error,
        })
        return
      }

      toast({
        title: 'Cadastro realizado!',
        description: result.message,
      })

      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao processar o cadastro',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="João"
                  {...register('nome')}
                  disabled={isLoading}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  placeholder="Silva"
                  {...register('sobrenome')}
                  disabled={isLoading}
                />
                {errors.sobrenome && (
                  <p className="text-sm text-destructive">{errors.sobrenome.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                maxLength={14}
                {...register('cpf')}
                onChange={(e) => {
                  e.target.value = formatCPF(e.target.value)
                }}
                disabled={isLoading}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                maxLength={15}
                {...register('telefone')}
                onChange={(e) => {
                  e.target.value = formatPhone(e.target.value)
                }}
                disabled={isLoading}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipo de Usuário <span className="text-destructive">*</span></Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sindico"
                    checked={selectedRole === 'sindico'}
                    onCheckedChange={() => handleRoleChange('sindico')}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="sindico"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Síndico
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin"
                    checked={selectedRole === 'admin_geral'}
                    onCheckedChange={() => handleRoleChange('admin_geral')}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="admin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Administrador Geral
                  </label>
                </div>
              </div>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Conta
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Fazer login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>Desenvolvido por Fluxo TI</p>
      </div>
    </div>
  )
}
