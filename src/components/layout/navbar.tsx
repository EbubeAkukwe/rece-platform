'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, LogOut, Settings, User, LayoutDashboard, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn, getInitials } from '@/lib/utils'
import { APP_CONFIG, ROUTES } from '@/config/app'
import { createClient } from '@/lib/supabase/client'
import { logoutAction } from '@/features/auth/actions'
import type { UserRole } from '@/types'

const NAV_LINKS = [
  { label: 'Home',         href: ROUTES.home },
  { label: 'Listings',     href: ROUTES.listings },
  { label: 'How It Works', href: ROUTES.howItWorks },
  { label: 'About',        href: ROUTES.about },
  { label: 'FAQ',          href: ROUTES.faq },
]

interface ProfileData {
  full_name: string
  role:      UserRole
  email:     string
}

function getDashboardRoute(role: UserRole) {
  switch (role) {
    case 'admin': return '/dashboard/admin'
    case 'agent': return '/dashboard/agent'
    default:      return '/dashboard/buyer'
  }
}

const linkClass = 'flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium hover:bg-accent transition-colors w-full'

export function Navbar() {
  const pathname                      = usePathname()
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [profile, setProfile]         = useState<ProfileData | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const supabase = createClient()

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role, email')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
    setAuthLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Get session from local storage immediately — no network call
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setAuthLoading(false)
      }
    })

    // Then listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadProfile(session.user.id)
        } else {
          setProfile(null)
          setAuthLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Shared auth UI — used in both desktop and mobile
  const AuthDesktop = () => {
    if (authLoading) {
      return <div className="w-28 h-8 rounded-lg bg-muted animate-pulse" />
    }

    if (profile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
              {getInitials(profile.full_name)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium leading-none">{profile.full_name.split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{profile.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1" sideOffset={8}>
            <div className="px-3 py-2 mb-1">
              <p className="text-sm font-semibold truncate">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
            <DropdownMenuSeparator />
            <Link href={getDashboardRoute(profile.role)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors w-full">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href={`${getDashboardRoute(profile.role)}/settings`} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors w-full">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href={`${getDashboardRoute(profile.role)}/settings`} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors w-full">
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors w-full text-red-600">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <>
        <Link href={ROUTES.login} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-foreground/5 transition-colors">
          Sign in
        </Link>
        <Link href={ROUTES.register} className="inline-flex items-center justify-center rounded-md bg-foreground text-background text-sm font-medium px-4 py-2 hover:bg-foreground/90 transition-colors">
          Get started
        </Link>
      </>
    )
  }

  const AuthMobile = () => {
    if (authLoading) {
      return <div className="w-full h-10 rounded-lg bg-muted animate-pulse" />
    }

    if (profile) {
      return (
        <>
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
              {getInitials(profile.full_name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
            </div>
          </div>
          <Link href={getDashboardRoute(profile.role)} onClick={() => setMobileOpen(false)} className={linkClass}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href={`${getDashboardRoute(profile.role)}/settings`} onClick={() => setMobileOpen(false)} className={linkClass}>
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors w-full">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </>
      )
    }

    return (
      <>
        <Link href={ROUTES.login} onClick={() => setMobileOpen(false)} className={linkClass}>
          Sign in
        </Link>
        <Link
          href={ROUTES.register}
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-center px-4 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors w-full"
        >
          Get started
        </Link>
      </>
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-background/95 backdrop-blur-sm border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">{APP_CONFIG.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-foreground bg-foreground/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <AuthDesktop />
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden p-2 rounded-md hover:bg-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center px-4 py-4 border-b">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                      <span className="text-background font-bold text-sm">R</span>
                    </div>
                    <span className="font-semibold">{APP_CONFIG.name}</span>
                  </Link>
                </div>

                <nav className="flex flex-col gap-1 p-4 flex-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                        pathname === link.href
                          ? 'text-foreground bg-foreground/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="p-4 border-t space-y-2">
                  <AuthMobile />
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </header>
  )
}
