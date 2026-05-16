import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AdminLeadActions } from '@/features/dashboard/components/admin-lead-actions'

export default async function AdminLeadDetailPage({
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

  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      prospect:profiles!leads_prospect_id_fkey(id, full_name, email, phone),
      agent:profiles!leads_agent_id_fkey(id, full_name, email),
      property:properties(id, title, city, country, slug)
    `)
    .eq('id', params.id)
    .single()

  if (!lead) notFound()

  // All agents for reassignment
  const { data: agents } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'agent')
    .eq('is_active', true)
    .order('full_name')

  // Activity log
  const { data: activities } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell
      role="admin"
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/admin/leads">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Lead Detail</h1>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(lead.created_at)}
            </p>
          </div>
        </div>

        {/* Lead overview */}
        <div className="bg-background border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Overview</h2>
            <Badge className="capitalize">{lead.status}</Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Prospect</p>
                <p className="font-medium">{lead.prospect?.full_name ?? '—'}</p>
                <p className="text-muted-foreground">{lead.prospect?.email}</p>
                {lead.prospect?.phone && (
                  <p className="text-muted-foreground">{lead.prospect.phone}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Property</p>
                {lead.property ? (
                  <Link
                    href={`/listings/${lead.property.slug}`}
                    className="font-medium hover:underline underline-offset-4"
                    target="_blank"
                  >
                    {lead.property.title}
                  </Link>
                ) : (
                  <p className="text-muted-foreground">No property linked</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Assigned agent</p>
                <p className="font-medium">{lead.agent?.full_name ?? 'Unassigned'}</p>
                {lead.agent?.email && (
                  <p className="text-muted-foreground">{lead.agent.email}</p>
                )}
              </div>
              {lead.notes && (
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-muted-foreground">{lead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin actions */}
        <AdminLeadActions
          leadId={params.id}
          currentStatus={lead.status}
          currentAgentId={lead.agent_id}
          agents={agents ?? []}
        />

        {/* Activity log */}
        {activities && activities.length > 0 && (
          <div className="bg-background border rounded-xl">
            <div className="p-5 border-b">
              <h2 className="font-semibold">Activity Log</h2>
            </div>
            <div className="divide-y">
              {activities.map((activity: any) => (
                <div key={activity.id} className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium capitalize">
                      {activity.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                  {activity.content && (
                    <p className="text-sm text-muted-foreground">{activity.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
