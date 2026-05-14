import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'About Us' }

const TEAM_VALUES = [
  {
    title: 'Transparency first',
    description: 'No hidden fees, no ghost listings. Every data point you see is accurate and up to date.',
  },
  {
    title: 'Built for everyone',
    description: 'Whether you are a first-time buyer or a seasoned investor, the platform adapts to your needs.',
  },
  {
    title: 'Speed matters',
    description: 'Leads routed in seconds. Listings live in minutes. Decisions made with real-time data.',
  },
  {
    title: 'Global by design',
    description: 'Multi-currency, multi-country, and built to scale across markets from day one.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <Badge variant="outline">About R.E.C.E</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Real estate infrastructure for the modern world
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              R.E.C.E was built to solve a simple problem — the real estate industry moves slowly,
              and buyers, sellers, and agents deserve better tools. We built the platform we wished existed.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Our mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that finding, buying, and selling property should be as straightforward
                as any other major transaction. The friction, the delays, the lack of transparency
                — none of it has to exist.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                R.E.C.E is a commission engine at its core — a platform that qualifies buyers,
                connects them with the right agents, and tracks every step of the deal through
                to a completed commission. No spreadsheets. No chasing. Just results.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {TEAM_VALUES.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-xl border bg-card space-y-3"
                >
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
