'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function agentUpdateLeadAction(leadId: string, status: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify this lead belongs to the agent
  const { data: lead } = await supabase
    .from('leads')
    .select('agent_id')
    .eq('id', leadId)
    .single()

  if (!lead || lead.agent_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('leads')
    .update({
      status,
      last_contact_at: ['contacted', 'qualified'].includes(status)
        ? new Date().toISOString()
        : undefined,
    })
    .eq('id', leadId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/agent/leads')
  revalidatePath(`/dashboard/agent/leads/${leadId}`)
  return { success: true }
}

export async function agentLogActivityAction(
  leadId: string,
  type: string,
  content: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership
  const { data: lead } = await supabase
    .from('leads')
    .select('agent_id')
    .eq('id', leadId)
    .single()

  if (!lead || lead.agent_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('lead_activities')
    .insert({
      lead_id:  leadId,
      actor_id: user.id,
      type,
      content,
    })

  if (error) return { error: error.message }

  // Update last_contact_at
  await supabase
    .from('leads')
    .update({ last_contact_at: new Date().toISOString() })
    .eq('id', leadId)

  revalidatePath(`/dashboard/agent/leads/${leadId}`)
  return { success: true }
}
