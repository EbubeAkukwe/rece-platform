'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateUserRoleAction(userId: string, role: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: admin } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (admin?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}

export async function toggleUserStatusAction(userId: string, isActive: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: admin } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (admin?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/leads')
  revalidatePath('/dashboard/agent/leads')
  return { success: true }
}

export async function assignLeadToAgentAction(leadId: string, agentId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('leads')
    .update({ agent_id: agentId })
    .eq('id', leadId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/leads')
  return { success: true }
}

export async function adminUpdateListingStatusAction(
  listingId: string,
  status: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', listingId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/listings')
  revalidatePath('/listings')
  return { success: true }
}

export async function adminDeleteListingAction(listingId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', listingId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/listings')
  revalidatePath('/listings')
  return { success: true }
}
