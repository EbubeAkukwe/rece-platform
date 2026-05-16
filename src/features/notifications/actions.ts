'use server'

import { createClient } from '@/lib/supabase/server'
import { triggerEvent } from '@/lib/pusher/server'

interface CreateNotificationParams {
  userId:     string
  title:      string
  message:    string
  type:       'lead' | 'listing' | 'system' | 'message'
  actionUrl?: string
  metadata?:  Record<string, unknown>
}

export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id:    params.userId,
      title:      params.title,
      message:    params.message,
      type:       params.type,
      action_url: params.actionUrl,
      metadata:   params.metadata ?? {},
    })
    .select()
    .single()

  if (error || !data) return { error: error?.message }

  // Push realtime event via Pusher
  try {
    await triggerEvent(
      `private-user-${params.userId}`,
      'new-notification',
      data
    )
  } catch (err) {
    // Pusher failure shouldn't break the notification save
    console.error('Pusher trigger failed:', err)
  }

  return { data }
}
