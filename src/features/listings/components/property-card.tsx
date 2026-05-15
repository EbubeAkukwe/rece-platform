'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bed, Bath, Maximize2, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { Property } from '@/types'

interface Props {
  property: Property & { property_images?: { url: string; is_cover: boolean }[] }
  isSaved?: boolean
  onSave?: (id: string) => void
}

export function PropertyCard({ property, isSaved = false, onSave }: Props) {
  const coverImage =
    property.property_images?.find((img) => img.is_cover)?.url ??
    property.property_images?.[0]?.url ??
    null

  return (
    <div className="group bg-background border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="capitalize">
            {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
          {property.is_new_build && (
            <Badge variant="secondary">New Build</Badge>
          )}
          {property.is_featured && (
            <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
          )}
        </div>

        {/* Save button */}
        {onSave && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onSave(property.id)
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-sm"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
              )}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="font-bold text-lg leading-tight">
            {formatCurrency(property.price, property.currency)}
          </p>
          <Link
            href={`/listings/${property.slug}`}
            className="font-medium text-sm hover:underline underline-offset-4 line-clamp-1"
          >
            {property.title}
          </Link>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {property.city}, {property.country}
          </span>
        </div>

        {/* Property specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {property.bathrooms} bath
            </span>
          )}
          {property.area_sqft && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              {property.area_sqft.toLocaleString()} sqft
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
