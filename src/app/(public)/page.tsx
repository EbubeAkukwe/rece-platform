import Link from 'next/link'
import { ArrowRight, Search, Shield, Zap, Globe, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const STATS = [
  { label: 'Properties Listed',  value: '12,000+' },
  { label: 'Qualified Buyers',   value: '48,000+' },
  { label: 'Agents Onboarded',   value: '1,200+' },
  { label: 'Countries Covered',  value: '30+' },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Property Matching',
    description:
      'Our onboarding engine learns your preferences and surfaces listings that actually fit your budget, lifestyle, and timeline.',
  },
  {
    icon: Shield,
    title: 'Verified Listings Only',
    description:
      'Every property is reviewed before going live. No ghost listings, no bait-and-switch — just real opportunities.',
  },
  {
    icon: Zap,
    title: 'Instant Lead Routing',
    description:
      'Buyer inquiries are automatically matched and routed to the right agent within seconds, not hours.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description:
      'Browse properties across 30+ countries with multi-currency support and localised market insights.',
  },
  {
    icon: TrendingUp,
    title: 'Commission Tracking',
    description:
      'Agents get a transparent real-time view of their pipeline, leads, and commission earnings.',
  },
  {
    icon: Users,
    title: 'Full Admin Control',
    description:
      'Admins manage every listing, lead, user, and payout from a single real-time dashboard.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create your account',
    description: 'Sign up as a buyer, seller, or agent in under 2 minutes.',
  },
  {
    step: '02',
    title: 'Complete your profile',
    description:
      'Buyers answer a short onboarding questionnaire so we can tailor recommendations to you.',
  },
  {
    step: '03',
    title: 'Browse or get matched',
    description:
      'Explore curated listings or let our engine surface the right properties for your needs.',
  },
  {
    step: '04',
    title: 'Connect and close',
    description:
      'Inquire directly, get assigned an agent, and move through the process with full visibility.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-700/40 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl space-y-8">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/10">
              Global Real Estate Platform
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Find your next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                property
              </span>{' '}
              the smart way.
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              R.E.C.E connects buyers, sellers, and agents on one modern platform —
              with intelligent matching, verified listings, and real-time lead management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold" asChild>
                <Link href="/register">
                  Get started free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/listings">Browse listings</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <Badge variant="outline">Platform Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-muted-foreground text-lg">
              Built for buyers who want clarity, agents who want efficiency, and admins who want control.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border bg-card hover:border-foreground/20 hover:shadow-md transition-all duration-200 space-y-4"
              >
                <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <Badge variant="outline">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              From signup to sold in four steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative space-y-4">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-1rem)] w-full h-px bg-border" />
                )}
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
            Ready to find your next property?
          </h2>
          <p className="text-background/70 text-lg max-w-xl mx-auto">
            Join thousands of buyers, sellers, and agents already using R.E.C.E to move faster and smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 font-semibold"
              asChild
            >
              <Link href="/register">
                Create free account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-background/30 text-background hover:bg-background/10 hover:text-background"
              asChild
            >
              <Link href="/how-it-works">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
