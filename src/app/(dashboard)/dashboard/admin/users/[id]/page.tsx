import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AdminUserActions } from '@/features/dashboard/components/admin-user-actions'

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard/buyer')

  const { data: targetUser } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!targetUser) notFound()

  const [
    { count: leadsCount },
    { count: listingsCount },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('prospect_id', params.id),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('agent_id', params.id),
    supabase.from('leads')
      .select('id, status, created_at')
      .or(`prospect_id.eq.${params.id},agent_id.eq.${params.id}`)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <DashboardShell
      role="admin"
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/admin/users">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{targetUser.full_name}</h1>
            <p className="text-sm text-muted-foreground">{targetUser.email}</p>
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-background border rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-bold shrink-0">
                {targetUser.full_name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">{targetUser.full_name}</p>
                <p className="text-sm text-muted-foreground">{targetUser.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{targetUser.role}</Badge>
                  <Badge variant={targetUser.is_active ? 'default' : 'destructive'}>
                    {targetUser.is_active ? 'Active' : 'Suspended'}
                  </Badge>
                  {targetUser.is_verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium">{formatDate(targetUser.created_at)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {targetUser.role === 'agent' ? 'Listings' : 'Leads'}
              </p>
              <p className="text-sm font-medium">
                {targetUser.role === 'agent' ? listingsCount : leadsCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{targetUser.phone ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <AdminUserActions
          userId={params.id}
          currentRole={targetUser.role}
          isActive={targetUser.is_active}
          isVerified={targetUser.is_verified}
          isSelf={params.id === user.id}
        />

        {/* Recent activity */}
        {recentLeads && recentLeads.length > 0 && (
          <div className="bg-background border rounded-xl">
            <div className="p-5 border-b">
              <h2 className="font-semibold">Recent Lead Activity</h2>
            </div>
            <div className="divide-y">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </p>
                  <Badge variant="outline" className="capitalize">{lead.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
