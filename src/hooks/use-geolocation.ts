'use client'

import { useState, useEffect } from 'react'

interface LocationState {
  city?:      string
  country?:   string
  latitude?:  number
  longitude?: number
  loading:    boolean
  error?:     string
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({ loading: true })

  useEffect(() => {
    // Check sessionStorage first — don't ask again on same session
    const cached = sessionStorage.getItem('rece-location')
    if (cached) {
      setLocation({ ...JSON.parse(cached), loading: false })
      return
    }

    if (!navigator.geolocation) {
      setLocation({ loading: false, error: 'Geolocation not supported' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Reverse geocode using free API — no key needed
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const city    = data.address?.city ?? data.address?.town ?? data.address?.village ?? data.address?.county
          const country = data.address?.country

          const loc = { city, country, latitude, longitude, loading: false }
          sessionStorage.setItem('rece-location', JSON.stringify(loc))
          setLocation(loc)
        } catch {
          setLocation({ latitude, longitude, loading: false })
        }
      },
      () => {
        setLocation({ loading: false, error: 'Location permission denied' })
      },
      { timeout: 8000 }
    )
  }, [])

  return location
}
