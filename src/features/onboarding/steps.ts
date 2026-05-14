export interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  fields: string[]
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'demographics',
    title: 'Tell us about yourself',
    subtitle: 'This helps us personalise your experience.',
    fields: ['age_range', 'family_size', 'employment_status', 'monthly_income'],
  },
  {
    id: 'property',
    title: 'What are you looking for?',
    subtitle: 'Define your ideal property.',
    fields: ['listing_type', 'bedrooms', 'bathrooms', 'new_build', 'budget_min', 'budget_max', 'currency'],
  },
  {
    id: 'location',
    title: 'Where do you want to live?',
    subtitle: 'Add your preferred countries and cities.',
    fields: ['preferred_countries', 'preferred_cities'],
  },
  {
    id: 'lifestyle',
    title: 'What describes you best?',
    subtitle: 'We use this to match you with the right properties.',
    fields: ['lifestyle'],
  },
  {
    id: 'finance',
    title: 'Financial readiness',
    subtitle: 'Help agents understand your buying position.',
    fields: ['mortgage_ready', 'cash_buyer', 'has_savings', 'move_in_timeline'],
  },
]

export const AGE_RANGES = [
  '18–24', '25–34', '35–44', '45–54', '55–64', '65+',
]

export const INCOME_RANGES = [
  'Under $1,000', '$1,000–$2,999', '$3,000–$4,999',
  '$5,000–$9,999', '$10,000–$19,999', '$20,000+',
]

export const CURRENCIES = [
  { code: 'USD', label: 'USD — US Dollar' },
  { code: 'GBP', label: 'GBP — British Pound' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'NGN', label: 'NGN — Nigerian Naira' },
  { code: 'CAD', label: 'CAD — Canadian Dollar' },
  { code: 'AUD', label: 'AUD — Australian Dollar' },
  { code: 'AED', label: 'AED — UAE Dirham' },
  { code: 'GHS', label: 'GHS — Ghanaian Cedi' },
  { code: 'KES', label: 'KES — Kenyan Shilling' },
  { code: 'ZAR', label: 'ZAR — South African Rand' },
]

export const LIFESTYLE_OPTIONS = [
  { value: 'newly_married',     label: 'Newly married',       emoji: '💍' },
  { value: 'expecting',         label: 'Growing family',      emoji: '👶' },
  { value: 'retired',           label: 'Retired',             emoji: '🌅' },
  { value: 'luxury',            label: 'Luxury living',       emoji: '✨' },
  { value: 'young_professional',label: 'Young professional',  emoji: '💼' },
  { value: 'investor',          label: 'Property investor',   emoji: '📈' },
]

export const MOVE_IN_TIMELINES = [
  { value: 'immediately',           label: 'As soon as possible' },
  { value: 'one_to_three_months',   label: '1–3 months' },
  { value: 'three_to_six_months',   label: '3–6 months' },
  { value: 'six_plus_months',       label: '6+ months' },
  { value: 'just_browsing',         label: 'Just browsing' },
]
