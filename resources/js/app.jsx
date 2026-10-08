import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ClerkProvider } from '@clerk/react';
import { clerkVariables } from '@/lib/clerkAppearance';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function getInitialColorScheme() {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('salomao-theme') === 'dark' ? 'dark' : 'light';
}

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ClerkProvider
                publishableKey={clerkPubKey}
                appearance={{
                    colorScheme: getInitialColorScheme(),
                    variables: clerkVariables,
                }}
            >
                <App {...props} />
            </ClerkProvider>
        );
    },
    progress: {
        color: 'var(--color-primary)',
        delay: 150,
    },
});
