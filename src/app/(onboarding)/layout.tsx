import type { Metadata } from 'next'
import Link from 'next/link'
import { APP_CONFIG } from '@/config/app'

export const metadata: Metadata = { title: 'Get Started' }

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background font-bold text-sm">R</span>
            </div>
            <span className="font-semibold hidden sm:block">{APP_CONFIG.name}</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            Setting up your profile
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
