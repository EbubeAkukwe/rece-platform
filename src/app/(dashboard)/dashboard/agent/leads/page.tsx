import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

interface SearchParams { status?: string; page?: string }
const PAGE_SIZE = 20

const STATUS_COLORS: Record<string, any> = {
  new:       'default',
  contacted: 'secondary',
  qualified: 'secondary',
  converted: 'secondary',
  lost:      'outline',
}

export default async function AgentLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'agent') redirect('/dashboard/buyer')

  const page = parseInt(searchParams.page ?? '1') - 1
  const from = page * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  let query = supabase
    .from('leads')
    .select(`
      *,
      prospect:profiles!leads_prospect_id_fkey(full_name, email, phone),
      property:properties(id, title, city, slug)
    `, { count: 'exact' })
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  const { data: leads, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  // Counts per status for summary
  const { data: statusCounts } = await supabase
    .from('leads')
    .select('status')
    .eq('agent_id', user.id)

  const summary = (statusCounts ?? []).reduce((acc: Record<string, number>, l: any) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <DashboardShell
      role="agent"
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Leads</h1>
          <p className="text-muted-foreground mt-1">
            {count ?? 0} total leads assigned to you
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {['new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => (
            <Link
              key={s}
              href={`?status=${s}`}
              className={`p-3 rounded-xl border text-center transition-colors hover:border-foreground/30 ${
                searchParams.status === s ? 'border-foreground bg-foreground/5' : 'bg-background'
              }`}
            >
              <p className="text-xl font-bold">{summary[s] ?? 0}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{s}</p>
            </Link>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => (
            <Link
              key={s}
              href={s === 'all' ? '/dashboard/agent/leads' : `?status=${s}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                (searchParams.status ?? 'all') === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background hover:bg-muted border-border'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Leads table */}
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Prospect</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Property</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads && leads.length > 0 ? (
                  leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <p className="font-medium">{lead.prospect?.full_name ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">{lead.prospect?.email}</p>
                          {lead.prospect?.phone && (
                            <p className="text-xs text-muted-foreground">{lead.prospect.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {lead.property ? (
                          <div className="space-y-0.5">
                            <p className="truncate max-w-[180px]">{lead.property.title}</p>
                            <p className="text-xs text-muted-foreground">{lead.property.city}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_COLORS[lead.status]} className="capitalize">
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/agent/leads/${lead.id}`}>
                            Manage
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground">
                      <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 0 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`?page=${page}&status=${searchParams.status ?? 'all'}`}>
                      Previous
                    </Link>
                  </Button>
                )}
                {page + 1 < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`?page=${page + 2}&status=${searchParams.status ?? 'all'}`}>
                      Next
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
