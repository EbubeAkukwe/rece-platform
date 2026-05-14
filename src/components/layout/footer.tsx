import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'

const FOOTER_LINKS = {
  Platform: [
    { label: 'Listings',     href: '/listings' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing',      href: '/pricing' },
    { label: 'Blog',         href: '/blog' },
  ],
  Company: [
    { label: 'About',   href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use',   href: '/terms' },
    { label: 'Cookie Policy',  href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                <span className="text-background font-bold text-sm">R</span>
              </div>
              <span className="font-semibold">{APP_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The smarter way to buy, sell, and manage real estate globally.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="space-y-3">
              <h4 className="text-sm font-semibold">{group}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_CONFIG.fullName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for real estate professionals worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
