'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useGeolocation } from '@/hooks/use-geolocation'

export function LocationInjector() {
  const location     = useGeolocation()
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only inject on listings page with no existing search/location params
    if (pathname !== '/listings') return
    if (location.loading) return
    if (!location.city && !location.country) return

    const hasUserSearch = searchParams.get('q')
    const hasLocation   = searchParams.get('city') || searchParams.get('country')

    if (hasUserSearch || hasLocation) return

    // Inject location silently into URL
    const params = new URLSearchParams(searchParams.toString())
    if (location.city)    params.set('city', location.city)
    if (location.country) params.set('country', location.country)

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [location, pathname, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
