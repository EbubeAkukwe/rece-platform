import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { deleteListingAction, updateListingStatusAction } from '@/features/listings/actions'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'

export default async function AgentListingDetailPage({
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

  if (!profile || profile.role !== 'agent') redirect('/dashboard/buyer')

  const { data: listing } = await supabase
    .from('properties')
    .select('*, property_images(url, is_cover, position)')
    .eq('id', params.id)
    .eq('agent_id', user.id)
    .single()

  if (!listing) notFound()

  const { data: leads } = await supabase
    .from('leads')
    .select('id, status, created_at, profiles!leads_prospect_id_fkey(full_name, email)')
    .eq('property_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell
      role="agent"
      userName={profile.full_name}
      userEmail={profile.email}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/agent/listings">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight line-clamp-1">
                {listing.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Listed {formatDate(listing.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/listings/${listing.slug}`} target="_blank">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                View live
              </Link>
            </Button>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-background border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Listing Details</h2>
            <Badge className="capitalize">
              {listing.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground text-xs">Price</p>
                <p className="font-semibold">
                  {formatCurrency(listing.price, listing.currency)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Type</p>
                <p className="capitalize">{listing.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Location</p>
                <p>{listing.city}, {listing.country}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground text-xs">Bedrooms</p>
                <p>{listing.bedrooms}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Bathrooms</p>
                <p>{listing.bathrooms}</p>
              </div>
              {listing.area_sqft && (
                <div>
                  <p className="text-muted-foreground text-xs">Area</p>
                  <p>{Number(listing.area_sqft).toLocaleString()} sqft</p>
                </div>
              )}
            </div>
          </div>

          {/* Status actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {(['available', 'under_offer', 'sold', 'withdrawn'] as const).map(
              (status) => (
                <form key={status} action={async () => {
                  'use server'
                  await updateListingStatusAction(listing.id, status)
                }}>
                  <Button
                    type="submit"
                    variant={listing.status === status ? 'default' : 'outline'}
                    size="sm"
                    className="capitalize"
                  >
                    {status.replace('_', ' ')}
                  </Button>
                </form>
              )
            )}
            <form action={async () => {
              'use server'
              await deleteListingAction(listing.id)
            }}>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
              >
                Delete listing
              </Button>
            </form>
          </div>
        </div>

        {/* Leads for this listing */}
        <div className="bg-background border rounded-xl">
          <div className="p-5 border-b">
            <h2 className="font-semibold">
              Leads for this listing
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({leads?.length ?? 0})
              </span>
            </h2>
          </div>

          {leads && leads.length > 0 ? (
            <div className="divide-y">
              {leads.map((lead: any) => (
                <div
                  key={lead.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium truncate">
                      {lead.profiles?.full_name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.profiles?.email} · {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize shrink-0">
                    {lead.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No leads for this listing yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
