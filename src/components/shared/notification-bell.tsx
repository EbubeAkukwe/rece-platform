'use client'

import { Bell, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications } from '@/hooks/use-notifications'
import { cn, formatDate } from '@/lib/utils'

interface Props {
  userId: string
}

export function NotificationBell({ userId }: Props) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications(userId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative p-2 rounded-md hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-semibold text-sm">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                type="button"
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                  !notif.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                )}
              >
                <div className="flex items-start gap-3">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  )}
                  <div className={cn('space-y-0.5', notif.read && 'pl-5')}>
                    <p className="text-sm font-medium leading-tight">
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDate(notif.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
