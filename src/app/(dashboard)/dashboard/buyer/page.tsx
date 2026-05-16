import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { StatCard } from '@/components/shared/stat-card'
import { Heart, ClipboardList, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function BuyerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role !== 'buyer' && profile.role !== 'seller') {
    redirect(`/dashboard/${profile.role}`)
  }

  const [
    { count: savedCount },
    { count: leadsCount },
    { count: notifCount },
  ] = await Promise.all([
    supabase.from('saved_properties').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('prospect_id', user.id),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false),
  ])

  return (
    <DashboardShell
      role={profile.role}
      userName={profile.full_name}
      userEmail={profile.email}
      userId={user.id}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {profile.full_name.split(' ')[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your property search.
            </p>
          </div>
          <Button asChild>
            <Link href="/listings">
              <Search className="w-4 h-4 mr-2" />
              Browse listings
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Saved Properties"
            value={savedCount ?? 0}
            subtitle="Properties you have saved"
            icon={Heart}
          />
          <StatCard
            title="Active Leads"
            value={leadsCount ?? 0}
            subtitle="Inquiries you have submitted"
            icon={ClipboardList}
          />
          <StatCard
            title="Unread Notifications"
            value={notifCount ?? 0}
            subtitle="Messages and updates"
            icon={Bell}
          />
        </div>

        {!profile.onboarding_completed && (
          <div className="bg-foreground text-background rounded-xl p-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold">Complete your profile</p>
              <p className="text-sm text-background/70">
                Tell us what you are looking for so we can match you with the right properties.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-background/30 text-background hover:bg-background/10 hover:text-background shrink-0"
              asChild
            >
              <Link href="/onboarding">Get started</Link>
            </Button>
          </div>
        )}

        <div className="bg-background border rounded-xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">No saved properties yet</p>
            <p className="text-sm text-muted-foreground">
              Browse listings and save the ones you like.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/listings">Browse listings</Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}
