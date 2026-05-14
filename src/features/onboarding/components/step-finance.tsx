'use client'

import { useOnboardingStore } from '@/store/onboarding.store'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { MOVE_IN_TIMELINES } from '../steps'
import { Check } from 'lucide-react'

export function StepFinance() {
  const { data, updateData } = useOnboardingStore()

  function toggle(field: 'mortgage_ready' | 'cash_buyer' | 'has_savings') {
    updateData({ [field]: !data[field] })
  }

  return (
    <div className="space-y-6">
      {/* Financial flags */}
      <div className="space-y-3">
        <Label>Financial position (select all that apply)</Label>
        <div className="space-y-2">
          {[
            { key: 'mortgage_ready', label: 'I have mortgage pre-approval', desc: 'A lender has confirmed your borrowing capacity' },
            { key: 'cash_buyer',     label: 'I am a cash buyer',            desc: 'You can purchase without a mortgage' },
            { key: 'has_savings',    label: 'I have savings ready',         desc: 'You have funds set aside for a deposit' },
          ].map(({ key, label, desc }) => {
            const isSelected = !!data[key as keyof typeof data]
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key as any)}
                className={cn(
                  'w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all',
                  isSelected
                    ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                    : 'border-border hover:border-foreground/40'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    isSelected ? 'bg-foreground border-foreground' : 'border-muted-foreground'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-background" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Move-in timeline */}
      <div className="space-y-3">
        <Label>When are you looking to move in?</Label>
        <div className="space-y-2">
          {MOVE_IN_TIMELINES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateData({ move_in_timeline: opt.value as any })}
              className={cn(
                'w-full py-3 px-4 rounded-lg border text-sm font-medium text-left transition-all',
                data.move_in_timeline === opt.value
                  ? 'border-foreground bg-foreground/5 ring-1 ring-foreground'
                  : 'border-border hover:border-foreground/40'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
