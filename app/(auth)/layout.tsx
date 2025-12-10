import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>
}
