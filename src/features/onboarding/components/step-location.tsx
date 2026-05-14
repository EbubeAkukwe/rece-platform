'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/store/onboarding.store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'

export function StepLocation() {
  const { data, updateData } = useOnboardingStore()
  const [countryInput, setCountryInput] = useState('')
  const [cityInput, setCityInput] = useState('')

  const countries = data.preferred_countries ?? []
  const cities    = data.preferred_cities ?? []

  function addCountry() {
    const val = countryInput.trim()
    if (val && !countries.includes(val)) {
      updateData({ preferred_countries: [...countries, val] })
    }
    setCountryInput('')
  }

  function removeCountry(c: string) {
    updateData({ preferred_countries: countries.filter((x) => x !== c) })
  }

  function addCity() {
    const val = cityInput.trim()
    if (val && !cities.includes(val)) {
      updateData({ preferred_cities: [...cities, val] })
    }
    setCityInput('')
  }

  function removeCity(c: string) {
    updateData({ preferred_cities: cities.filter((x) => x !== c) })
  }

  return (
    <div className="space-y-6">
      {/* Countries */}
      <div className="space-y-3">
        <Label>Preferred countries</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. United Kingdom"
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
          />
          <Button type="button" variant="outline" size="icon" onClick={addCountry}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {countries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1 bg-foreground/5 border rounded-full px-3 py-1 text-sm"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeCountry(c)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cities */}
      <div className="space-y-3">
        <Label>Preferred cities</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Lagos, London, Dubai"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
          />
          <Button type="button" variant="outline" size="icon" onClick={addCity}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {cities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1 bg-foreground/5 border rounded-full px-3 py-1 text-sm"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeCity(c)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Press Enter or click + to add. You can add multiple.
        </p>
      </div>
    </div>
  )
}
