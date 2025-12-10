'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Building2,
  Users,
  AlertTriangle,
  ThumbsUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    section: 'principal',
    items: [
      { icon: BarChart3, label: 'Dashboard', href: '/dashboard', badge: null },
      { icon: Building2, label: 'Condomínios', href: '/condominios', badge: null },
      { icon: Users, label: 'Usuários', href: '/usuarios', badge: null },
      { icon: AlertTriangle, label: 'Ocorrências', href: '/ocorrencias', badge: '12' },
      { icon: ThumbsUp, label: 'NPS & Satisfação', href: '/nps', badge: null },
    ],
  },
  {
    section: 'configurações',
    items: [
      { icon: Settings, label: 'Configurações', href: '/configuracoes', badge: null },
    ],
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full border-r bg-background transition-all duration-300',
          'lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]',
          // Mobile
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Desktop collapsed/expanded
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
          // Mobile always full width when open
          'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header - Mobile only */}
          <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">CondoAssist</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((group, idx) => (
              <div key={group.section} className={idx > 0 ? 'mt-6' : ''}>
                {!isCollapsed && (
                  <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.section}
                  </p>
                )}
                {isCollapsed && idx > 0 && (
                  <Separator className="my-2" />
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link key={item.href} href={item.href} onClick={onClose}>
                        <Button
                          variant={isActive ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start',
                            isCollapsed && 'justify-center px-2',
                            isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                          )}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Collapse Toggle - Desktop only */}
          <div className="hidden lg:block border-t p-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn('w-full', isCollapsed && 'px-2')}
              onClick={toggleCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  <span>Recolher</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
