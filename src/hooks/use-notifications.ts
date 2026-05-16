'use client'

import { useEffect, useState } from 'react'
import { getPusherClient } from '@/lib/pusher/client'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [loading, setLoading]             = useState(true)

  // Fetch existing notifications on mount
  useEffect(() => {
    async function fetchNotifications() {
      const supabase = createClient()
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      }
      setLoading(false)
    }

    fetchNotifications()
  }, [userId])

  // Subscribe to realtime Pusher events
  useEffect(() => {
    const pusher  = getPusherClient()
    const channel = pusher.subscribe(`private-user-${userId}`)

    channel.bind('new-notification', (data: Notification) => {
      setNotifications((prev) => [data, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`private-user-${userId}`)
    }
  }, [userId])

  async function markAsRead(id: string) {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  async function markAllAsRead() {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead }
}
