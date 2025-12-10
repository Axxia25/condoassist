'use client'

import { Bell, Building2, LogOut, Menu, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from './ThemeToggle'
import { logoutAction } from '@/app/auth/actions'
import type { DashboardUser } from '@/lib/types'

interface HeaderProps {
  user: DashboardUser
  onMenuClick: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
  }

  const getInitials = (name: string, sobrenome?: string | null) => {
    const firstInitial = name.charAt(0).toUpperCase()
    const lastInitial = sobrenome ? sobrenome.charAt(0).toUpperCase() : ''
    return `${firstInitial}${lastInitial}`
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin_geral: 'Administrador Geral',
      sindico: 'Síndico',
      operador: 'Operador',
    }
    return roles[role] || role
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="hidden font-semibold sm:inline-block">
              CondoAssist
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
                <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 text-sm text-muted-foreground">
                  Nenhuma notificação nova
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user.nome, user.sobrenome)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm">
                  {user.nome}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.nome} {user.sobrenome}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
