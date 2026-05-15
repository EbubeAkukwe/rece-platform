'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import type { CreateListingInput } from './schemas'

interface ImageData {
  url:      string
  isCover:  boolean
  position: number
}

export async function createListingAction(
  data: CreateListingInput,
  images: ImageData[] = []
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'agent' && profile.role !== 'admin')) {
    return { error: 'Only agents and admins can create listings' }
  }

  const amenities = data.amenities
    ? data.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : []

  const nearby = data.nearby
    ? data.nearby.split(',').map((n) => n.trim()).filter(Boolean)
    : []

  const slug = slugify(data.title) + '-' + Date.now()

  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      title:        data.title,
      slug,
      description:  data.description,
      price:        data.price,
      currency:     data.currency,
      listing_type: data.listing_type,
      status:       data.status,
      bedrooms:     data.bedrooms,
      bathrooms:    data.bathrooms,
      toilets:      data.toilets,
      area_sqft:    data.area_sqft,
      address:      data.address,
      city:         data.city,
      state:        data.state,
      country:      data.country,
      is_new_build: data.is_new_build,
      is_featured:  data.is_featured,
      video_url:    data.video_url || null,
      amenities,
      nearby,
      agent_id:     user.id,
      created_by:   user.id,
      published_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Save images if provided
  if (images.length > 0) {
    const { error: imgError } = await supabase
      .from('property_images')
      .insert(
        images.map((img) => ({
          property_id: property.id,
          url:         img.url,
          is_cover:    img.isCover,
          position:    img.position,
        }))
      )
    if (imgError) console.error('Image save error:', imgError.message)
  }

  revalidatePath('/listings')
  revalidatePath('/dashboard/agent/listings')

  redirect(`/dashboard/agent/listings/${property.id}`)
}

export async function updateListingStatusAction(id: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/listings')
  revalidatePath('/dashboard/agent/listings')
  return { success: true }
}

export async function deleteListingAction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/listings')
  revalidatePath('/dashboard/agent/listings')
  redirect('/dashboard/agent/listings')
}
