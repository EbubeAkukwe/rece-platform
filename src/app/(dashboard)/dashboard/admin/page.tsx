import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { StatCard } from '@/components/shared/stat-card'
import { Building2, ClipboardList, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role !== 'admin') redirect(`/dashboard/${profile.role}`)

  const [
    { count: usersCount },
    { count: listingsCount },
    { count: leadsCount },
    { count: newLeadsCount },
    { data: commissions },
    { data: recentLeads },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('commissions').select('commission_amount, status'),
    supabase
      .from('leads')
      .select('id, status, created_at, profiles!leads_prospect_id_fkey(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totalCommissions = commissions
    ?.filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + (c.commission_amount ?? 0), 0) ?? 0

  return (
    <DashboardShell
      role="admin"
      userName={profile.full_name}
      userEmail={profile.email}
    >
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">
            Platform-wide activity at a glance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={usersCount ?? 0}
            subtitle="All registered users"
            icon={Users}
          />
          <StatCard
            title="Listings"
            value={listingsCount ?? 0}
            subtitle="All properties"
            icon={Building2}
          />
          <StatCard
            title="Leads"
            value={leadsCount ?? 0}
            subtitle={`${newLeadsCount ?? 0} new`}
            icon={ClipboardList}
          />
          <StatCard
            title="Total Commissions"
            value={formatCurrency(totalCommissions)}
            subtitle="Paid out"
            icon={DollarSign}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent leads */}
          <div className="bg-background border rounded-xl">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="font-semibold">Recent Leads</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/admin/leads">View all</Link>
              </Button>
            </div>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="divide-y">
                {recentLeads.map((lead: any) => (
                  <div key={lead.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium truncate">
                        {lead.profiles?.full_name ?? 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.profiles?.email}
                      </p>
                    </div>
                    <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>
                      {lead.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No leads yet.</p>
              </div>
            )}
          </div>

          {/* Recent users */}
          <div className="bg-background border rounded-xl">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="font-semibold">Recent Users</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/admin/users">View all</Link>
              </Button>
            </div>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="divide-y">
                {recentUsers.map((u: any) => (
                  <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium truncate">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="capitalize shrink-0">
                      {u.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No users yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
