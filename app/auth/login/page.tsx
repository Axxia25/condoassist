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
import { useToast } from '@/hooks/use-toast'

import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { loginAction } from '../actions'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)

    try {
      const result = await loginAction(data)

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: result.error,
        })
        return
      }

      toast({
        title: 'Login realizado!',
        description: 'Redirecionando...',
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao fazer login',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">CondoAssist Dashboard</CardTitle>
          <CardDescription>
            Sistema de Gestão para Administração de Condomínios
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{' '}
              <Link
                href="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                Cadastre-se
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
