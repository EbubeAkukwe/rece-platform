'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { LIFESTYLE_OPTIONS } from '../steps'

export function StepLifestyle() {
  const { data, updateData } = useOnboardingStore()

  return (
    <div className="space-y-4">
      <Label>Select the option that best describes you</Label>
      <div className="grid grid-cols-2 gap-3">
        {LIFESTYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateData({ lifestyle: opt.value as any })}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
              data.lifestyle === opt.value
                ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                : 'border-border hover:border-foreground/40'
            )}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
