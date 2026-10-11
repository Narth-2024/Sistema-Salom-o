import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { registerServiceWorker } from '@/lib/pwa';

registerServiceWorker();

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        router.on('inertia:httpException', (event) => {
            if (event.detail?.response?.status === 419) {
                window.location.reload()
            }
        })

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: 'var(--color-primary)',
        delay: 150,
    },
});
