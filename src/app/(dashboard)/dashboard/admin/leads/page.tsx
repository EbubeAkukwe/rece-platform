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

export default async function AdminLeadsPage({
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

  if (!profile || profile.role !== 'admin') redirect('/dashboard/buyer')

  const page = parseInt(searchParams.page ?? '1') - 1
  const from = page * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  let query = supabase
    .from('leads')
    .select(`
      *,
      prospect:profiles!leads_prospect_id_fkey(full_name, email),
      agent:profiles!leads_agent_id_fkey(full_name),
      property:properties(title, city)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  const { data: leads, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const statusColors: Record<string, string> = {
    new:       'default',
    contacted: 'secondary',
    qualified: 'secondary',
    converted: 'secondary',
    lost:      'outline',
  }

  return (
    <DashboardShell
      role="admin"
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground mt-1">{count ?? 0} total leads</p>
          </div>
        </div>

        {/* Status filter */}
        <div className="bg-background border rounded-xl p-4">
          <form className="flex flex-wrap gap-2">
            {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((s) => (
              <button
                key={s}
                name="status"
                value={s}
                type="submit"
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                  (searchParams.status ?? 'all') === s
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                {s}
              </button>
            ))}
          </form>
        </div>

        {/* Table */}
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Prospect</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Property</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Agent</th>
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
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <p className="truncate max-w-[200px]">{lead.property?.title ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">{lead.property?.city}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                        {lead.agent?.full_name ?? 'Unassigned'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColors[lead.status] as any} className="capitalize">
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/admin/leads/${lead.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
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
                    <Link href={`?page=${page}&status=${searchParams.status ?? 'all'}`}>Previous</Link>
                  </Button>
                )}
                {page + 1 < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`?page=${page + 2}&status=${searchParams.status ?? 'all'}`}>Next</Link>
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
