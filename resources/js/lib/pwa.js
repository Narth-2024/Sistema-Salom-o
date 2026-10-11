import { useSyncExternalStore } from 'react'

let deferredPrompt = null
let installed = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
const listeners = new Set()

function notify() {
    for (const listener of listeners) listener()
}

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        deferredPrompt = event
        notify()
    })
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null
        installed = true
        notify()
    })
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (event) => {
        installed = event.matches
        notify()
    })
}

export function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => null)
    })
}

function subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

export function usePWAInstall() {
    const canInstall = useSyncExternalStore(
        subscribe,
        () => deferredPrompt !== null,
        () => false
    )
    const isInstalled = useSyncExternalStore(
        subscribe,
        () => installed,
        () => false
    )
    const isIOS =
        typeof navigator !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !window.MSStream

    async function promptInstall() {
        if (!deferredPrompt) return 'unavailable'
        deferredPrompt.prompt()
        const result = await deferredPrompt.userChoice.catch(() => ({ outcome: 'dismissed' }))
        deferredPrompt = null
        notify()
        return result.outcome
    }

    return { canInstall, isInstalled, isIOS, promptInstall }
}
