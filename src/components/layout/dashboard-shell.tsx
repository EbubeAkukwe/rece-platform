import { Sidebar } from './sidebar'
import type { UserRole } from '@/types'

interface Props {
  role: UserRole
  userName: string
  userEmail: string
  children: React.ReactNode
}

export function DashboardShell({ role, userName, userEmail, children }: Props) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar role={role} userName={userName} userEmail={userEmail} />

      {/* Main content — offset for sidebar on desktop */}
      <div className="lg:pl-64 pt-14 lg:pt-0">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
