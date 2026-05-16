import { Sidebar } from './sidebar'
import { NotificationBell } from '@/components/shared/notification-bell'
import type { UserRole } from '@/types'

interface Props {
  role:      UserRole
  userName:  string
  userEmail: string
  userId:    string
  children:  React.ReactNode
}

export function DashboardShell({
  role,
  userName,
  userEmail,
  userId,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar role={role} userName={userName} userEmail={userEmail} />

      {/* Top bar with notification bell */}
      <div className="lg:pl-64">
        <div className="hidden lg:flex items-center justify-end px-8 py-3 border-b bg-background">
          <NotificationBell userId={userId} />
        </div>

        <main className="min-h-screen p-4 sm:p-6 lg:p-8 pt-14 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
