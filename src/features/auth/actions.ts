'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { LoginInput, RegisterInput } from './schemas'

function getDashboardRoute(role: string): string {
  switch (role) {
    case 'admin':  return '/dashboard/admin'
    case 'agent':  return '/dashboard/agent'
    case 'buyer':
    case 'seller':
    default:       return '/dashboard/buyer'
  }
}

export async function loginAction(data: LoginInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication failed' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  revalidatePath('/', 'layout')

  if (profile?.role === 'buyer' && !profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  redirect(getDashboardRoute(profile?.role ?? 'buyer'))
}

export async function registerAction(data: RegisterInput) {
  const supabase = await createClient()

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        role: data.role,
      },
    },
  })

  // Log full error for debugging
  if (error) {
    console.error('Supabase signUp error:', JSON.stringify(error, null, 2))
    return { error: error.message }
  }

  console.log('signUp success, user id:', signUpData?.user?.id)

  revalidatePath('/', 'layout')

  if (data.role === 'buyer') {
    redirect('/onboarding')
  }

  redirect(getDashboardRoute(data.role))
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPasswordAction(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function resetPasswordAction(password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }

  redirect('/login?reset=success')
}
