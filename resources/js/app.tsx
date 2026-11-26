import '../css/app.css';

import { Toaster } from '@/components/ui/sonner';
import type { Flash } from '@/types';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/** Show the server's flash message (->with('success'|'error', ...)) as a toast. */
function showFlash(flash?: Flash) {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster richColors position="bottom-right" />
            </>,
        );

        showFlash(props.initialPage.props.flash as Flash | undefined);
        router.on('success', (event) => showFlash(event.detail.page.props.flash as Flash | undefined));
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
