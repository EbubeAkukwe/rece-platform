const CACHE_NAME = 'rece-v1'
const OFFLINE_URL = '/offline'

const PRECACHE_URLS = [
  '/',
  '/offline',
  '/listings',
  '/manifest.json',
]

// Install — precache key pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — network first, fall back to cache, then offline page
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith('http')) return

  const url = new URL(event.request.url)

  // Cache-first for images
  if (
    url.hostname.includes('supabase.co') ||
    event.request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached ?? fetch(event.request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return res
        })
      )
    )
    return
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Cache successful page navigations
        if (event.request.mode === 'navigate') {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return res
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) => cached ?? (
            event.request.mode === 'navigate'
              ? caches.match(OFFLINE_URL)
              : new Response('Offline', { status: 503 })
          )
        )
      )
  )
})
