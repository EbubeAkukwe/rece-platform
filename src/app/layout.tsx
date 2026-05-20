import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from '@/components/shared/query-provider'
import { PWAInstallPrompt } from '@/components/shared/pwa-install-prompt'
import { PWARegister } from '@/components/shared/pwa-register'
import { APP_CONFIG } from '@/config/app'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default:  APP_CONFIG.fullName,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  manifest:    '/manifest.json',
  appleWebApp: {
    capable:        true,
    statusBarStyle: 'default',
    title:          APP_CONFIG.name,
  },
  icons: {
    icon:  '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a0a' },
  ],
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <PWAInstallPrompt />
            <PWARegister />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
