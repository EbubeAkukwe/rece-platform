export const APP_CONFIG = {
  name: 'R.E.C.E',
  fullName: 'Real Estate Commission Engine',
  description: 'A modern real estate lead generation, qualification, and commission management platform.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? 'USD',
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en',
} as const

export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  AGENT: 'agent',
  ADMIN: 'admin',
} as const

export const ROUTES = {
  home: '/',
  about: '/about',
  howItWorks: '/how-it-works',
  faq: '/faq',
  blog: '/blog',
  listings: '/listings',
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  dashboard: {
    buyer: '/dashboard/buyer',
    agent: '/dashboard/agent',
    admin: '/dashboard/admin',
  },
} as const
