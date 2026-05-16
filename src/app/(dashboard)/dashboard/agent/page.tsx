import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { StatCard } from '@/components/shared/stat-card'
import { Building2, ClipboardList, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function AgentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role !== 'agent') redirect(`/dashboard/${profile.role}`)

  const [
    { count: listingsCount },
    { count: leadsCount },
    { count: newLeadsCount },
    { data: commissions },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('agent_id', user.id),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('agent_id', user.id),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('agent_id', user.id).eq('status', 'new'),
    supabase.from('commissions').select('agent_payout, status').eq('agent_id', user.id),
  ])

  const totalEarned = commissions
    ?.filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + (c.agent_payout ?? 0), 0) ?? 0

  const pendingPayout = commissions
    ?.filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + (c.agent_payout ?? 0), 0) ?? 0

  const { data: recentLeads } = await supabase
    .from('leads')
    .select('id, status, created_at, profiles!leads_prospect_id_fkey(full_name, email)')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <DashboardShell
      role="agent"
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agent Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {profile.full_name.split(' ')[0]}.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/agent/listings/new">
              <Building2 className="w-4 h-4 mr-2" />
              Add listing
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Listings"    value={listingsCount ?? 0}          subtitle={`Active properties`}        icon={Building2}    />
          <StatCard title="Total Leads"    value={leadsCount ?? 0}             subtitle={`${newLeadsCount ?? 0} new`} icon={ClipboardList} />
          <StatCard title="Total Earned"   value={formatCurrency(totalEarned)} subtitle="Paid commissions"           icon={DollarSign}   />
          <StatCard title="Pending Payout" value={formatCurrency(pendingPayout)} subtitle="Approved, not yet paid"   icon={TrendingUp}   />
        </div>

        <div className="bg-background border rounded-xl">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-semibold">Recent Leads</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/agent/leads">View all</Link>
            </Button>
          </div>
          {recentLeads && recentLeads.length > 0 ? (
            <div className="divide-y">
              {recentLeads.map((lead: any) => (
                <div key={lead.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-medium truncate">{lead.profiles?.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.profiles?.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={lead.status === 'new' ? 'default' : lead.status === 'converted' ? 'secondary' : 'outline'}>
                      {lead.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/agent/leads/${lead.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
