import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { auth } = usePage<SharedData>().props;
    const subtitle = auth.user?.role === 'admin' ? 'Store admin' : 'My account';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold tracking-tight">ABIIO SHOP</span>
                <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
            </div>
        </>
    );
}
