/*
 * Service Worker — Salomão
 * - HTML/navegação: network-first → cache → offline.html
 * - /build/* e fontes: stale-while-revalidate
 * - Precache do shell (app.js/css) via /build/manifest.json no install
 */

const VERSION = 'v1'
const STATIC_CACHE = `salomao-static-${VERSION}`
const PAGES_CACHE = `salomao-pages-${VERSION}`
const PRECACHE_PATHS = ['/offline.html']

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(STATIC_CACHE)

        // Descobre os assets com hash do build atual via manifest do Vite
        try {
            const manifestRes = await fetch('/build/manifest.json', { cache: 'no-store' })
            if (manifestRes.ok) {
                const manifest = await manifestRes.json()

                // Entrada de JS (app.jsx)
                const jsEntry = manifest['resources/js/app.jsx']
                if (jsEntry) {
                    PRECACHE_PATHS.push('/build/' + jsEntry.file)
                    for (const css of jsEntry.css || []) PRECACHE_PATHS.push('/build/' + css)
                }

                // Entrada de CSS (app.css) — no laravel-vite-plugin é uma entrada separada
                const cssEntry = manifest['resources/css/app.css']
                if (cssEntry) {
                    PRECACHE_PATHS.push('/build/' + cssEntry.file)
                    for (const css of cssEntry.css || []) PRECACHE_PATHS.push('/build/' + css)
                }
            }
        } catch {
            // offline no primeiro install: o runtime caching cobre depois
        }

        await Promise.allSettled(
            PRECACHE_PATHS.map((path) =>
                cache.add(new Request(path, { cache: 'reload' })).catch(() => null)
            )
        )
    })())
})

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys()
        await Promise.all(
            keys
                .filter((key) => key.startsWith('salomao-') && key !== STATIC_CACHE && key !== PAGES_CACHE)
                .map((key) => caches.delete(key))
        )
        await self.clients.claim()
    })())
})

async function handleNavigation(request) {
    try {
        const response = await fetch(request)
        if (response.ok) {
            const cache = await caches.open(PAGES_CACHE)
            cache.put(request, response.clone())
        }
        return response
    } catch {
        const cached = await caches.match(request)
        if (cached) return cached
        const offline = await caches.match('/offline.html')
        if (offline) return offline
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(STATIC_CACHE)
    const cached = await cache.match(request)
    const refresh = fetch(request)
        .then((response) => {
            if (response && response.ok && response.type !== 'opaque') {
                cache.put(request, response.clone())
            }
            return response
        })
        .catch(() => null)
    if (cached) return cached
    const response = await refresh
    return response || new Response('', { status: 504 })
}

self.addEventListener('fetch', (event) => {
    const { request } = event
    if (request.method !== 'GET') return

    const url = new URL(request.url)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return

    // Navegações e pedidos de HTML (visitas Inertia): network-first
    const accept = request.headers.get('accept') || ''
    const isNavigation = request.mode === 'navigate'
    const isHtmlRequest =
        url.origin === self.location.origin &&
        accept.includes('text/html') &&
        !url.pathname.startsWith('/build/') &&
        !url.pathname.startsWith('/api/')

    if (isNavigation || isHtmlRequest) {
        event.respondWith(handleNavigation(request))
        return
    }

    // Assets com hash do build: cache-first com refresh em segundo plano
    if (url.origin === self.location.origin && url.pathname.startsWith('/build/')) {
        event.respondWith(staleWhileRevalidate(request))
        return
    }

    // Google Fonts
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(staleWhileRevalidate(request))
    }
})
