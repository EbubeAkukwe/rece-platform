import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { PropertyCard } from '@/features/listings/components/property-card'
import { ListingsFilters } from '@/features/listings/components/listings-filters'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = { title: 'Property Listings' }

interface SearchParams {
  q?:      string
  type?:   string
  beds?:   string
  min?:    string
  max?:    string
  status?: string
  page?:   string
}

const PAGE_SIZE = 12

async function ListingsGrid({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page ?? '1') - 1
  const from = page * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  let query = supabase
    .from('properties')
    .select(`
      *,
      property_images (url, is_cover)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%,country.ilike.%${searchParams.q}%`
    )
  }
  if (searchParams.type && searchParams.type !== 'any') {
    query = query.eq('listing_type', searchParams.type)
  }
  if (searchParams.beds && searchParams.beds !== 'any') {
    query = query.gte('bedrooms', parseInt(searchParams.beds))
  }
  if (searchParams.min) {
    query = query.gte('price', parseFloat(searchParams.min))
  }
  if (searchParams.max) {
    query = query.lte('price', parseFloat(searchParams.max))
  }
  if (searchParams.status && searchParams.status !== 'any') {
    query = query.eq('status', searchParams.status)
  } else if (!searchParams.status) {
    query = query.eq('status', 'available')
  }

  const { data: properties, count } = await query

  if (!properties || properties.length === 0) {
    return (
      <div className="col-span-full py-24 text-center space-y-3">
        <p className="font-medium">No properties found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <>
      {properties.map((property: any) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </>
  )
}

function ListingsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </>
  )
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Property Listings</h1>
          <Badge variant="outline">Global</Badge>
        </div>
        <p className="text-muted-foreground">
          Browse verified properties for sale and rent worldwide.
        </p>
      </div>

      {/* Filters */}
      <Suspense>
        <ListingsFilters />
      </Suspense>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<ListingsSkeleton />}>
          <ListingsGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
