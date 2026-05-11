import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OnboardingData } from '@/types'

interface OnboardingState {
  step: number
  data: Partial<OnboardingData>
  completed: boolean
  setStep: (step: number) => void
  updateData: (data: Partial<OnboardingData>) => void
  setCompleted: (completed: boolean) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      data: {},
      completed: false,
      setStep: (step) => set({ step }),
      updateData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
      setCompleted: (completed) => set({ completed }),
      reset: () => set({ step: 0, data: {}, completed: false }),
    }),
    {
      name: 'rece-onboarding',
    }
  )
)
