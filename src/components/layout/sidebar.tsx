'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { APP_CONFIG } from '@/config/app'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard, Home, Users, Building2, TrendingUp,
  Bell, Settings, LogOut, Menu, X, ChevronRight,
  ClipboardList, DollarSign, Heart, Search,
} from 'lucide-react'
import { useState } from 'react'
import { logoutAction } from '@/features/auth/actions'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href:  string
  icon:  React.ElementType
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Overview',       href: '/dashboard/admin',              icon: LayoutDashboard },
    { label: 'Listings',       href: '/dashboard/admin/listings',     icon: Building2 },
    { label: 'Leads',          href: '/dashboard/admin/leads',        icon: ClipboardList },
    { label: 'Users',          href: '/dashboard/admin/users',        icon: Users },
    { label: 'Commissions',    href: '/dashboard/admin/commissions',  icon: DollarSign },
    { label: 'Notifications',  href: '/dashboard/admin/notifications',icon: Bell },
    { label: 'Settings',       href: '/dashboard/admin/settings',     icon: Settings },
  ],
  agent: [
    { label: 'Overview',       href: '/dashboard/agent',              icon: LayoutDashboard },
    { label: 'My Listings',    href: '/dashboard/agent/listings',     icon: Building2 },
    { label: 'My Leads',       href: '/dashboard/agent/leads',        icon: ClipboardList },
    { label: 'Commissions',    href: '/dashboard/agent/commissions',  icon: DollarSign },
    { label: 'Notifications',  href: '/dashboard/agent/notifications',icon: Bell },
    { label: 'Settings',       href: '/dashboard/agent/settings',     icon: Settings },
  ],
  buyer: [
    { label: 'Overview',       href: '/dashboard/buyer',              icon: LayoutDashboard },
    { label: 'Browse',         href: '/listings',                     icon: Search },
    { label: 'Saved',          href: '/dashboard/buyer/saved',        icon: Heart },
    { label: 'My Leads',       href: '/dashboard/buyer/leads',        icon: ClipboardList },
    { label: 'Notifications',  href: '/dashboard/buyer/notifications',icon: Bell },
    { label: 'Settings',       href: '/dashboard/buyer/settings',     icon: Settings },
  ],
  seller: [
    { label: 'Overview',       href: '/dashboard/buyer',              icon: LayoutDashboard },
    { label: 'My Listings',    href: '/dashboard/buyer/listings',     icon: Building2 },
    { label: 'Notifications',  href: '/dashboard/buyer/notifications',icon: Bell },
    { label: 'Settings',       href: '/dashboard/buyer/settings',     icon: Settings },
  ],
}

interface Props {
  role: UserRole
  userName: string
  userEmail: string
}

export function Sidebar({ role, userName, userEmail }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const items = NAV_ITEMS[role] ?? NAV_ITEMS.buyer

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shrink-0">
            <span className="text-background font-bold text-sm">R</span>
          </div>
          <span className="font-semibold">{APP_CONFIG.name}</span>
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User + logout */}
      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-background shrink-0 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b h-14 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
            <span className="text-background font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-sm">{APP_CONFIG.name}</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md hover:bg-foreground/5 transition-colors"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
