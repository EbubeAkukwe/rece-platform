'use client'

import { useGeolocation } from '@/hooks/use-geolocation'
import { useSearchParams } from 'next/navigation'
import { MapPin, Loader2 } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

export function LocationHeading() {
  const location      = useGeolocation()
  const searchParams  = useSearchParams()
  const hasSearch     = searchParams.get('q') || searchParams.get('type') || searchParams.get('beds')

  if (location.loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Detecting your location…
      </div>
    )
  }

  if (hasSearch || !location.city) return null

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="w-3.5 h-3.5 text-foreground" />
      <span>
        Showing properties near{' '}
        <strong className="text-foreground">
          {[location.city, location.country].filter(Boolean).join(', ')}
        </strong>
      </span>
    </div>
  )
}
