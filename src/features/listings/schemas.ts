import { z } from 'zod'

export const createListingSchema = z.object({
  title:           z.string().min(10, 'Title must be at least 10 characters'),
  description:     z.string().min(30, 'Description must be at least 30 characters'),
  price:           z.coerce.number().positive('Price must be a positive number'),
  currency:        z.string().min(1, 'Currency is required'),
  listing_type:    z.enum(['sale', 'rent']),
  status:          z.enum(['available', 'under_offer', 'sold', 'withdrawn']).default('available'),
  bedrooms:        z.coerce.number().min(0).default(0),
  bathrooms:       z.coerce.number().min(0).default(0),
  toilets:         z.coerce.number().min(0).default(0),
  area_sqft:       z.coerce.number().optional(),
  address:         z.string().min(3, 'Address is required'),
  city:            z.string().min(1, 'City is required'),
  state:           z.string().optional(),
  country:         z.string().min(1, 'Country is required'),
  is_new_build:    z.boolean().default(false),
  is_featured:     z.boolean().default(false),
  amenities:       z.string().optional(), // comma-separated
  nearby:          z.string().optional(), // comma-separated
  video_url:       z.string().url().optional().or(z.literal('')),
})

export type CreateListingInput = z.infer<typeof createListingSchema>
