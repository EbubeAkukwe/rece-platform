import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = { title: 'FAQ' }

const FAQS = [
  {
    q: 'Is R.E.C.E free to use?',
    a: 'Signing up and browsing listings is completely free for buyers and sellers. Agents are on a commission-based model — you only pay when a deal closes.',
  },
  {
    q: 'What countries are supported?',
    a: 'R.E.C.E supports listings and transactions across 30+ countries with multi-currency support. If your country is not listed, contact us — we are expanding rapidly.',
  },
  {
    q: 'How does buyer matching work?',
    a: 'When you sign up as a buyer, you complete a short onboarding questionnaire covering your budget, preferred locations, lifestyle, and financial readiness. Our engine uses these inputs to surface the most relevant listings for you.',
  },
  {
    q: 'How are leads assigned to agents?',
    a: 'When a buyer inquires about a property or submits a general lead, the system automatically routes it to the most relevant available agent based on the listing and location. Admins can also manually reassign leads.',
  },
  {
    q: 'How is commission calculated?',
    a: 'Commission is calculated as a percentage of the final sale price. The platform takes a small platform fee from the commission, and the remainder is the agent payout. All figures are visible in the agent dashboard before and after a deal closes.',
  },
  {
    q: 'Can I list a property as a seller without an agent?',
    a: 'Sellers can sign up and submit property details, but listings go live after being reviewed and approved by an assigned agent or admin.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. The platform uses row-level security on every database table, meaning users can only access data they are permitted to see. All data is encrypted in transit and at rest.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach us via the contact form on this site or by emailing support@rece.io. We aim to respond within one business day.',
  },
]

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="outline">FAQ</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Frequently asked questions
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl mx-auto">
            Everything you need to know about the platform.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border rounded-xl px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}
