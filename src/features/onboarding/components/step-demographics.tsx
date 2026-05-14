'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AGE_RANGES, INCOME_RANGES } from '../steps'

export function StepDemographics() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-6">
      {/* Age range */}
      <div className="space-y-3">
        <Label>Age range</Label>
        <div className="grid grid-cols-3 gap-2">
          {AGE_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => updateData({ age_range: range })}
              className={cn(
                'py-2 px-3 rounded-lg border text-sm font-medium transition-all',
                data.age_range === range
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Family size */}
      <div className="space-y-2">
        <Label htmlFor="family_size">Family size (including yourself)</Label>
        <Input
          id="family_size"
          type="number"
          min={1}
          max={20}
          placeholder="e.g. 4"
          value={data.family_size ?? ''}
          onChange={(e) =>
            updateData({ family_size: parseInt(e.target.value) || undefined })
          }
          className="max-w-xs"
        />
      </div>

      {/* Employment */}
      <div className="space-y-3">
        <Label>Employment status</Label>
        <div className="grid grid-cols-2 gap-2">
          {['Employed', 'Self-employed', 'Business owner', 'Retired', 'Student', 'Other'].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateData({ employment_status: status })}
                className={cn(
                  'py-2 px-3 rounded-lg border text-sm font-medium text-left transition-all',
                  data.employment_status === status
                    ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                    : 'border-border hover:border-foreground/40'
                )}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Income */}
      <div className="space-y-3">
        <Label>Monthly income (approx.)</Label>
        <div className="grid grid-cols-2 gap-2">
          {INCOME_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => updateData({ monthly_income: range })}
              className={cn(
                'py-2 px-3 rounded-lg border text-sm font-medium text-left transition-all',
                data.monthly_income === range
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
