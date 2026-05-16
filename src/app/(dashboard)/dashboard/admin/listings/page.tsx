import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Building2, Search } from 'lucide-react'
import { adminUpdateListingStatusAction, adminDeleteListingAction } from '@/features/dashboard/actions/admin.actions'

interface SearchParams { q?: string; status?: string; page?: string }
const PAGE_SIZE = 20

export default async function AdminListingsPage({
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
    .from('properties')
    .select(`
      *,
      agent:profiles!properties_agent_id_fkey(full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%,country.ilike.%${searchParams.q}%`
    )
  }
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  const { data: listings, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

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
            <h1 className="text-2xl font-bold tracking-tight">Listings</h1>
            <p className="text-muted-foreground mt-1">{count ?? 0} total properties</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background border rounded-xl p-4">
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Search title, city, or country…"
                className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <select
              name="status"
              defaultValue={searchParams.status ?? 'all'}
              className="px-3 py-2 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="under_offer">Under Offer</option>
              <option value="sold">Sold</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            <Button type="submit" size="sm">Filter</Button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Agent</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Listed</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings && listings.length > 0 ? (
                  listings.map((listing: any) => (
                    <tr key={listing.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <p className="font-medium line-clamp-1">{listing.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {listing.city}, {listing.country}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-medium">
                        {formatCurrency(listing.price, listing.currency)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {listing.agent?.full_name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            listing.status === 'available'  ? 'default'   :
                            listing.status === 'sold'       ? 'secondary' :
                            'outline'
                          }
                          className="capitalize"
                        >
                          {listing.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {formatDate(listing.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/listings/${listing.slug}`} target="_blank">
                              View
                            </Link>
                          </Button>
                          {listing.status !== 'withdrawn' && (
                            <form action={async () => {
                              'use server'
                              await adminUpdateListingStatusAction(listing.id, 'withdrawn')
                            }}>
                              <Button variant="outline" size="sm" type="submit">
                                Withdraw
                              </Button>
                            </form>
                          )}
                          <form action={async () => {
                            'use server'
                            await adminDeleteListingAction(listing.id)
                          }}>
                            <Button variant="destructive" size="sm" type="submit">
                              Delete
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                      <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      No listings found
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
                    <Link href={`?page=${page}&status=${searchParams.status ?? 'all'}&q=${searchParams.q ?? ''}`}>
                      Previous
                    </Link>
                  </Button>
                )}
                {page + 1 < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`?page=${page + 2}&status=${searchParams.status ?? 'all'}&q=${searchParams.q ?? ''}`}>
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
