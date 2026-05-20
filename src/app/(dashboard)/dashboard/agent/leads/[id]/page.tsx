import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ChevronLeft, Phone, Mail, ExternalLink } from 'lucide-react'
import { AgentLeadActions } from '@/features/dashboard/components/agent-lead-actions'

export default async function AgentLeadDetailPage({
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

  const { data: lead } = await supabase
    .from('leads')
    .select(`
      *,
      prospect:profiles!leads_prospect_id_fkey(id, full_name, email, phone, city, country),
      property:properties(id, title, city, country, slug, price, currency, bedrooms, bathrooms)
    `)
    .eq('id', params.id)
    .eq('agent_id', user.id)
    .single()

  if (!lead) notFound()

  const { data: activities } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', params.id)
    .order('created_at', { ascending: false })

  const { data: onboarding } = await supabase
    .from('onboarding_data')
    .select('*')
    .eq('user_id', lead.prospect_id)
    .single()

  const prospect = lead.prospect as any
  const property = lead.property as any

  const mailtoHref = prospect?.email ? `mailto:${prospect.email}` : '#'
  const telHref    = prospect?.phone ? `tel:${prospect.phone}`    : '#'

  return (
    <DashboardShell
      role="agent"
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/agent/leads">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {prospect?.full_name ?? 'Lead Detail'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(lead.created_at)}
            </p>
          </div>
          <Badge className="ml-auto capitalize">{lead.status}</Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-6">

            {/* Prospect info */}
            <div className="bg-background border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold">Prospect</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-bold shrink-0">
                  {prospect?.full_name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="space-y-2 flex-1">
                  <p className="font-semibold">{prospect?.full_name}</p>
                  <div className="flex flex-col gap-1.5">
                    
                      href={mailtoHref}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {prospect?.email}
                    </a>
                    {prospect?.phone && (
                      
                        href={telHref}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {prospect.phone}
                      </a>
                    )}
                  </div>
                  {(prospect?.city || prospect?.country) && (
                    <p className="text-sm text-muted-foreground">
                      {[prospect.city, prospect.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Buyer preferences */}
            {onboarding && (
              <div className="bg-background border rounded-xl p-6 space-y-4">
                <h2 className="font-semibold">Buyer Profile</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {onboarding.listing_type && (
                    <div>
                      <p className="text-xs text-muted-foreground">Looking to</p>
                      <p className="font-medium capitalize">
                        {onboarding.listing_type === 'sale' ? 'Buy' : 'Rent'}
                      </p>
                    </div>
                  )}
                  {(onboarding.budget_min || onboarding.budget_max) && (
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-medium">
                        {onboarding.budget_min?.toLocaleString()} – {onboarding.budget_max?.toLocaleString()} {onboarding.currency}
                      </p>
                    </div>
                  )}
                  {onboarding.bedrooms != null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">
                        {onboarding.bedrooms === 0 ? 'Studio' : `${onboarding.bedrooms}+`}
                      </p>
                    </div>
                  )}
                  {onboarding.lifestyle && (
                    <div>
                      <p className="text-xs text-muted-foreground">Lifestyle</p>
                      <p className="font-medium capitalize">
                        {onboarding.lifestyle.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  {onboarding.move_in_timeline && (
                    <div>
                      <p className="text-xs text-muted-foreground">Timeline</p>
                      <p className="font-medium capitalize">
                        {onboarding.move_in_timeline.replace(/_/g, ' ')}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Financial</p>
                    <p className="font-medium">
                      {[
                        onboarding.cash_buyer     && 'Cash buyer',
                        onboarding.mortgage_ready && 'Mortgage ready',
                        onboarding.has_savings    && 'Has savings',
                      ].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                </div>

                {onboarding.preferred_cities?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Preferred locations</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        ...(onboarding.preferred_cities ?? []),
                        ...(onboarding.preferred_countries ?? []),
                      ].map((loc: string) => (
                        <span key={loc} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Activity log */}
            <div className="bg-background border rounded-xl">
              <div className="p-5 border-b">
                <h2 className="font-semibold">Activity Log</h2>
              </div>
              {activities && activities.length > 0 ? (
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
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No activity logged yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {/* Property card */}
            {property && (
              <div className="bg-background border rounded-xl p-5 space-y-3">
                <h2 className="font-semibold text-sm">Linked Property</h2>
                <div className="space-y-1.5">
                  <p className="font-medium text-sm line-clamp-2">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {property.city}, {property.country}
                  </p>
                  {property.bedrooms > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {property.bedrooms} bed · {property.bathrooms} bath
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <Link href={`/listings/${property.slug}`} target="_blank">
                    <ExternalLink className="w-3.5 h-3.5" />
                    View listing
                  </Link>
                </Button>
              </div>
            )}

            {/* Agent actions */}
            <AgentLeadActions leadId={params.id} currentStatus={lead.status} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
