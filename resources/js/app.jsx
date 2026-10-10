import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { router } from '@inertiajs/react';

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        router.onError((error) => {
            if (error.response?.status === 419) {
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
