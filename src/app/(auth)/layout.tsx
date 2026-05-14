import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'

export const metadata: Metadata = {
  title: 'Authentication',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-slate-900 font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-lg">{APP_CONFIG.name}</span>
        </Link>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            The smarter way to buy, sell, and manage real estate.
          </h1>
          <p className="text-slate-400 text-lg">
            Connect with qualified buyers, streamline leads, and track commissions — all in one platform.
          </p>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <span>© {new Date().getFullYear()} {APP_CONFIG.fullName}</span>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg">{APP_CONFIG.name}</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
