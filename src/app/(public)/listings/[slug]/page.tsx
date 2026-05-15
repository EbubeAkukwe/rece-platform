import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Bed, Bath, Maximize2, MapPin, Calendar,
  Share2, Heart, ChevronLeft, Check,
} from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('properties')
    .select('title, description')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Property Not Found' }
  return { title: data.title, description: data.description.slice(0, 160) }
}

export default async function PropertyDetailPage({ params }: Props) {
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select(`
      *,
      property_images (url, alt, is_cover, position),
      profiles!properties_agent_id_fkey (full_name, email, phone, avatar_url)
    `)
    .eq('slug', params.slug)
    .single()

  if (!property) notFound()

  const images = (property.property_images ?? []).sort(
    (a: any, b: any) => a.position - b.position
  )
  const coverImage = images.find((i: any) => i.is_cover) ?? images[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/listings">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to listings
        </Link>
      </Button>

      {/* Image gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-2xl overflow-hidden">
        {/* Main image */}
        <div className="col-span-4 md:col-span-3 row-span-2 relative bg-muted">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt ?? property.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 75vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.slice(1, 3).map((img: any, i: number) => (
          <div key={i} className="hidden md:block relative bg-muted">
            <Image
              src={img.url}
              alt={img.alt ?? `Image ${i + 2}`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}</Badge>
              {property.is_new_build && <Badge variant="secondary">New Build</Badge>}
              {property.is_featured && (
                <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
              )}
              <Badge
                variant="outline"
                className="capitalize"
              >
                {property.status.replace('_', ' ')}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {property.title}
            </h1>

            <p className="text-3xl font-bold">
              {formatCurrency(property.price, property.currency)}
            </p>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {property.address}, {property.city}
                {property.state ? `, ${property.state}` : ''}, {property.country}
              </span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
            {property.bedrooms > 0 && (
              <div className="flex flex-col items-center gap-1 text-center">
                <Bed className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">{property.bedrooms}</span>
                <span className="text-xs text-muted-foreground">Bedrooms</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex flex-col items-center gap-1 text-center">
                <Bath className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">{property.bathrooms}</span>
                <span className="text-xs text-muted-foreground">Bathrooms</span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex flex-col items-center gap-1 text-center">
                <Maximize2 className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">
                  {Number(property.area_sqft).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Sq Ft</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">About this property</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby */}
          {property.nearby?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">What&apos;s nearby</h2>
              <div className="flex flex-wrap gap-2">
                {property.nearby.map((item: string) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Listed date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
            <Calendar className="w-4 h-4" />
            Listed {formatDate(property.created_at)}
          </div>
        </div>

        {/* Right — contact card */}
        <div className="space-y-4">
          <div className="bg-background border rounded-xl p-5 space-y-5 sticky top-6">
            <h3 className="font-semibold">Interested in this property?</h3>

            {/* Agent info */}
            {property.profiles && (
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold">
                    {property.profiles.full_name?.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {property.profiles.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">Agent</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/register?intent=inquiry&property=${property.slug}`}>
                  Request a viewing
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/register?intent=inquiry&property=${property.slug}`}>
                  Ask a question
                </Link>
              </Button>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="flex-1 gap-2">
                <Heart className="w-4 h-4" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
