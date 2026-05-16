import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Building2 } from 'lucide-react'

export default async function AgentListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'agent') redirect('/dashboard/buyer')

  const { data: listings } = await supabase
    .from('properties')
    .select('*, property_images(url, is_cover)')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell
      role="agent"
      userName={profile.full_name}
      userEmail={profile.email}
 userId={user.id}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your property listings.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/agent/listings/new">
              <Plus className="w-4 h-4 mr-2" />
              Add listing
            </Link>
          </Button>
        </div>

        {listings && listings.length > 0 ? (
          <div className="bg-background border rounded-xl divide-y">
            {listings.map((listing: any) => (
              <div
                key={listing.id}
                className="p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium truncate">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.city}, {listing.country} · {formatDate(listing.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-semibold hidden sm:block">
                    {formatCurrency(listing.price, listing.currency)}
                  </p>
                  <Badge
                    variant={
                      listing.status === 'available'   ? 'default'   :
                      listing.status === 'sold'        ? 'secondary' :
                      'outline'
                    }
                    className="capitalize"
                  >
                    {listing.status.replace('_', ' ')}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/agent/listings/${listing.id}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-background border rounded-xl p-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No listings yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first listing to get started.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/agent/listings/new">
                <Plus className="w-4 h-4 mr-2" />
                Add your first listing
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
