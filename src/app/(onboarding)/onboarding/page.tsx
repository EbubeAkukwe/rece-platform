import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, role, full_name')
    .eq('id', user.id)
    .single()

  // Non-buyers skip onboarding
  if (profile?.role && profile.role !== 'buyer') {
    redirect(`/dashboard/${profile.role}`)
  }

  // Already completed
  if (profile?.onboarding_completed) {
    redirect('/dashboard/buyer')
  }

  return <OnboardingWizard userName={profile?.full_name ?? 'there'} />
}
