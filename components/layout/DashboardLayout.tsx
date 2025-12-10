'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import type { DashboardUser } from '@/lib/types'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: DashboardUser
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Header */}
      <Header user={user} onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
