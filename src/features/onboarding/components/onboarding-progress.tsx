'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { OnboardingStep } from '../steps'

interface Props {
  steps: OnboardingStep[]
  currentStep: number
}

export function OnboardingProgress({ steps, currentStep }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: simple bar */}
      <div className="flex items-center gap-2 mb-6 sm:hidden">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div
            className="bg-foreground h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {steps.map((step, i) => {
          const isDone    = i < currentStep
          const isCurrent = i === currentStep

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-200',
                    isDone
                      ? 'bg-foreground border-foreground text-background'
                      : isCurrent
                      ? 'border-foreground text-foreground bg-background'
                      : 'border-muted-foreground/30 text-muted-foreground bg-background'
                  )}
                >
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'text-xs whitespace-nowrap',
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-px mx-2 mb-5 transition-colors duration-300',
                    isDone ? 'bg-foreground' : 'bg-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
