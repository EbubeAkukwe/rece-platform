'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { APP_CONFIG, ROUTES } from '@/config/app'

const NAV_LINKS = [
  { label: 'Home',         href: ROUTES.home },
  { label: 'Listings',     href: ROUTES.listings },
  { label: 'How It Works', href: ROUTES.howItWorks },
  { label: 'About',        href: ROUTES.about },
  { label: 'FAQ',          href: ROUTES.faq },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.login}>Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={ROUTES.register}>Get started</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-6 border-b">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                      <span className="text-background font-bold text-sm">R</span>
                    </div>
                    <span className="font-semibold">{APP_CONFIG.name}</span>
                  </Link>
                </div>

                <nav className="flex flex-col gap-1 py-6 flex-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
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

                <div className="flex flex-col gap-2 pt-6 border-t">
                  <Button variant="outline" asChild onClick={() => setOpen(false)}>
                    <Link href={ROUTES.login}>Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href={ROUTES.register}>Get started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
