'use client'

import { MapPin, X } from 'lucide-react'
import { useState } from 'react'
import { useGeolocation } from '@/hooks/use-geolocation'

export function LocationBanner() {
  const location              = useGeolocation()
  const [dismissed, setDismiss] = useState(false)

  if (location.loading || dismissed || (!location.city && !location.country)) {
    return null
  }

  return (
    <div className="bg-foreground/5 border-b px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-foreground" />
          <span>
            Showing properties near{' '}
            <strong className="text-foreground">
              {[location.city, location.country].filter(Boolean).join(', ')}
            </strong>
            {' '}— search to explore anywhere
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismiss(true)}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
