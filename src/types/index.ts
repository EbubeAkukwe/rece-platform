export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin'

export type PropertyStatus = 'available' | 'under_offer' | 'sold' | 'withdrawn'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export type ListingType = 'sale' | 'rent'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  status: PropertyStatus
  listing_type: ListingType
  bedrooms: number
  bathrooms: number
  area_sqft: number
  address: string
  city: string
  country: string
  latitude?: number
  longitude?: number
  images: string[]
  video_url?: string
  amenities: string[]
  agent_id: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  prospect_id: string
  agent_id?: string
  property_id?: string
  status: LeadStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface OnboardingData {
  age_range?: string
  family_size?: number
  employment_status?: string
  monthly_income?: string
  budget_min?: number
  budget_max?: number
  currency?: string
  listing_type?: ListingType
  bedrooms?: number
  new_build?: boolean
  lifestyle?: string
  mortgage_ready?: boolean
  cash_buyer?: boolean
  move_in_timeline?: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  type: 'lead' | 'listing' | 'system' | 'message'
  created_at: string
}
