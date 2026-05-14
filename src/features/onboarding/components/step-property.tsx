'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CURRENCIES } from '../steps'

export function StepProperty() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-6">
      {/* Listing type */}
      <div className="space-y-3">
        <Label>I am looking to</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'sale', label: 'Buy a property' },
            { value: 'rent', label: 'Rent a property' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateData({ listing_type: opt.value as 'sale' | 'rent' })}
              className={cn(
                'py-3 px-4 rounded-lg border text-sm font-medium transition-all',
                data.listing_type === opt.value
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label>Bedrooms needed</Label>
        <div className="flex gap-2 flex-wrap">
          {['Studio', '1', '2', '3', '4', '5+'].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => updateData({ bedrooms: b === 'Studio' ? 0 : parseInt(b) })}
              className={cn(
                'w-14 h-10 rounded-lg border text-sm font-medium transition-all',
                (b === 'Studio' ? data.bedrooms === 0 : data.bedrooms === parseInt(b))
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* New build */}
      <div className="space-y-3">
        <Label>Property type preference</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: false, label: 'Any property' },
            { value: true,  label: 'New build only' },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => updateData({ new_build: opt.value })}
              className={cn(
                'py-3 px-4 rounded-lg border text-sm font-medium transition-all',
                data.new_build === opt.value
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label>Budget range</Label>
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Min</span>
            <Input
              type="number"
              placeholder="50,000"
              value={data.budget_min ?? ''}
              onChange={(e) =>
                updateData({ budget_min: parseFloat(e.target.value) || undefined })
              }
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Max</span>
            <Input
              type="number"
              placeholder="500,000"
              value={data.budget_max ?? ''}
              onChange={(e) =>
                updateData({ budget_max: parseFloat(e.target.value) || undefined })
              }
            />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Currency</span>
            <select
              value={data.currency ?? 'USD'}
              onChange={(e) => updateData({ currency: e.target.value })}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
