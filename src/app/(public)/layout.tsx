import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { LocationBanner } from '@/components/shared/location-banner'
import { LocationInjector } from '@/features/listings/components/location-injector'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense>
        <LocationBanner />
        <LocationInjector />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
