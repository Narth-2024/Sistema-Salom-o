import './bootstrap';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ClerkProvider } from '@clerk/react';
import { registerServiceWorker } from '@/lib/pwa';
import ErrorBoundary from '@/Components/ErrorBoundary';
import useColorScheme from '@/hooks/useColorScheme';
import { clerkAppearance } from '@/lib/clerkAppearance';

registerServiceWorker();

/**
 * O ClerkProvider envolve o app inteiro porque o widget de login e o botão de
 * sair precisam da mesma instância do SDK.
 */
function Root({ App, props }) {
    const colorScheme = useColorScheme();

    return (
        <ClerkProvider
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            appearance={clerkAppearance(colorScheme)}
            signInUrl="/login"
            signUpUrl="/register"
        >
            <App {...props} />
        </ClerkProvider>
    );
}

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
        root.render(
            <ErrorBoundary>
                <Root App={App} props={props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: 'var(--color-primary)',
        delay: 150,
    },
});
