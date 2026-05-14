'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { OnboardingData } from '@/types'

export async function saveOnboardingAction(data: Partial<OnboardingData>) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Upsert onboarding data
  const { error: upsertError } = await supabase
    .from('onboarding_data')
    .upsert(
      {
        user_id: user.id,
        ...data,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (upsertError) return { error: upsertError.message }

  // Mark profile as onboarding complete
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  redirect('/dashboard/buyer')
}
