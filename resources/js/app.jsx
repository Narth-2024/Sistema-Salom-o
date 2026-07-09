import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ClerkProvider } from '@clerk/react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ClerkProvider publishableKey={clerkPubKey}>
                <App {...props} />
            </ClerkProvider>
        );
    },
    progress: {
        color: '#36802d',
    },
});
