'use client'

import { useTransition } from 'react'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { useOnboardingStore } from '@/store/onboarding.store'
import { Button } from '@/components/ui/button'
import { OnboardingProgress } from './onboarding-progress'
import { StepDemographics } from './step-demographics'
import { StepProperty } from './step-property'
import { StepLocation } from './step-location'
import { StepLifestyle } from './step-lifestyle'
import { StepFinance } from './step-finance'
import { saveOnboardingAction } from '../actions'
import { ONBOARDING_STEPS } from '../steps'

const STEP_COMPONENTS = [
  StepDemographics,
  StepProperty,
  StepLocation,
  StepLifestyle,
  StepFinance,
]

interface Props {
  userName: string
}

export function OnboardingWizard({ userName }: Props) {
  const { step, data, setStep } = useOnboardingStore()
  const [isPending, startTransition] = useTransition()

  const currentStepConfig = ONBOARDING_STEPS[step]
  const StepComponent = STEP_COMPONENTS[step]
  const isFirst = step === 0
  const isLast  = step === ONBOARDING_STEPS.length - 1

  function handleNext() {
    if (isLast) {
      startTransition(async () => {
        await saveOnboardingAction(data)
      })
    } else {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (!isFirst) setStep(step - 1)
  }

  return (
    <div className="space-y-6">
      {/* Welcome line — only on first step */}
      {isFirst && (
        <div className="text-center space-y-1 mb-8">
          <p className="text-muted-foreground">Welcome, {userName} 👋</p>
          <h1 className="text-2xl font-bold">Let&apos;s find your perfect property</h1>
          <p className="text-sm text-muted-foreground">
            Answer a few quick questions and we&apos;ll personalise your experience.
          </p>
        </div>
      )}

      <OnboardingProgress steps={ONBOARDING_STEPS} currentStep={step} />

      {/* Step card */}
      <div className="bg-background border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{currentStepConfig.title}</h2>
          <p className="text-sm text-muted-foreground">{currentStepConfig.subtitle}</p>
        </div>

        <StepComponent />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isFirst || isPending}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button type="button" onClick={handleNext} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : isLast ? (
              <>
                Finish setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Skip */}
      {!isLast && (
        <p className="text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => {
              startTransition(async () => {
                await saveOnboardingAction(data)
              })
            }}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </p>
      )}
    </div>
  )
}
