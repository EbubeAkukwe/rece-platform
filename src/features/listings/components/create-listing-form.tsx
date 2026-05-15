'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { createListingSchema, type CreateListingInput } from '../schemas'
import { createListingAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploader } from './image-uploader'
import { CURRENCIES } from '@/features/onboarding/steps'
import { createClient } from '@/lib/supabase/client'

interface UploadedImage {
  id:       string
  url:      string
  isCover:  boolean
  position: number
}

export function CreateListingForm() {
  const [serverError, setServerError]   = useState<string | null>(null)
  const [images, setImages]             = useState<UploadedImage[]>([])
  const [isPending, startTransition]    = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      currency:     'USD',
      listing_type: 'sale',
      status:       'available',
      bedrooms:     0,
      bathrooms:    0,
      toilets:      0,
      is_new_build: false,
      is_featured:  false,
    },
  })

  async function saveImages(propertyId: string) {
    if (images.length === 0) return
    const supabase = createClient()
    await supabase.from('property_images').insert(
      images.map((img) => ({
        property_id: propertyId,
        url:         img.url,
        is_cover:    img.isCover,
        position:    img.position,
      }))
    )
  }

  function onSubmit(data: CreateListingInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await createListingAction(data, images)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      {/* Images */}
      <div className="bg-background border rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold">Property Images</h2>
          <p className="text-xs text-muted-foreground">
            Upload 1–5 images. The starred image will be shown as the cover photo.
          </p>
        </div>
        <ImageUploader
          onImagesChange={setImages}
          maxImages={5}
        />
      </div>

      {/* Basic info */}
      <div className="bg-background border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Basic Information</h2>

        <div className="space-y-2">
          <Label htmlFor="title">Property title</Label>
          <Input
            id="title"
            placeholder="e.g. Stunning 3-bed apartment in central Lagos"
            disabled={isPending}
            {...register('title')}
          />
          {errors.title && (
            <p className="text-destructive text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the property in detail…"
            rows={5}
            disabled={isPending}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-destructive text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Listing type</Label>
            <Select
              defaultValue="sale"
              onValueChange={(v) => setValue('listing_type', v as 'sale' | 'rent')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue="available"
              onValueChange={(v) => setValue('status', v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="under_offer">Under Offer</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-background border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 250000"
              disabled={isPending}
              {...register('price')}
            />
            {errors.price && (
              <p className="text-destructive text-xs">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              defaultValue="USD"
              onValueChange={(v) => setValue('currency', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property details */}
      <div className="bg-background border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Property Details</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min={0}
              disabled={isPending}
              {...register('bedrooms')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min={0}
              disabled={isPending}
              {...register('bathrooms')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toilets">Toilets</Label>
            <Input
              id="toilets"
              type="number"
              min={0}
              disabled={isPending}
              {...register('toilets')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area_sqft">Area (sqft)</Label>
            <Input
              id="area_sqft"
              type="number"
              min={0}
              placeholder="Optional"
              disabled={isPending}
              {...register('area_sqft')}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center justify-between gap-4 p-4 border rounded-lg flex-1">
            <div>
              <p className="text-sm font-medium">New Build</p>
              <p className="text-xs text-muted-foreground">
                Is this a newly constructed property?
              </p>
            </div>
            <Switch onCheckedChange={(v) => setValue('is_new_build', v)} />
          </div>
          <div className="flex items-center justify-between gap-4 p-4 border rounded-lg flex-1">
            <div>
              <p className="text-sm font-medium">Featured Listing</p>
              <p className="text-xs text-muted-foreground">
                Highlight this property on the platform
              </p>
            </div>
            <Switch onCheckedChange={(v) => setValue('is_featured', v)} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-background border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Location</h2>

        <div className="space-y-2">
          <Label htmlFor="address">Street address</Label>
          <Input
            id="address"
            placeholder="e.g. 12 Victoria Island"
            disabled={isPending}
            {...register('address')}
          />
          {errors.address && (
            <p className="text-destructive text-xs">{errors.address.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g. Lagos"
              disabled={isPending}
              {...register('city')}
            />
            {errors.city && (
              <p className="text-destructive text-xs">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State / Region</Label>
            <Input
              id="state"
              placeholder="Optional"
              disabled={isPending}
              {...register('state')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="e.g. Nigeria"
              disabled={isPending}
              {...register('country')}
            />
            {errors.country && (
              <p className="text-destructive text-xs">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Amenities + nearby */}
      <div className="bg-background border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Amenities &amp; Nearby</h2>

        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Input
            id="amenities"
            placeholder="e.g. Swimming pool, Gym, 24hr Security, Generator"
            disabled={isPending}
            {...register('amenities')}
          />
          <p className="text-xs text-muted-foreground">Separate with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nearby">Nearby landmarks</Label>
          <Input
            id="nearby"
            placeholder="e.g. Schools, Hospitals, Shopping malls, Airport"
            disabled={isPending}
            {...register('nearby')}
          />
          <p className="text-xs text-muted-foreground">Separate with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video_url">Video tour URL</Label>
          <Input
            id="video_url"
            type="url"
            placeholder="https://youtube.com/..."
            disabled={isPending}
            {...register('video_url')}
          />
          {errors.video_url && (
            <p className="text-destructive text-xs">{errors.video_url.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" disabled={isPending}>
          Save as draft
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Publishing…
            </>
          ) : (
            'Publish listing'
          )}
        </Button>
      </div>
    </form>
  )
}
