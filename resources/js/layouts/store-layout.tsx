import { Navbar } from '@/components/ui/navbar';
import { CATEGORIES, COLLECTIONS } from '@/lib/catalog';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

/** Shared frame for every storefront page: sticky navbar, centred content, footer. */
export default function StoreLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-neutral-900">
            <AnnouncementBar />
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
            <Footer />
        </div>
    );
}

function AnnouncementBar() {
    return (
        <div className="bg-neutral-950 px-4 py-2 text-center text-xs tracking-widest text-white uppercase">
            New The 1975 pieces just dropped · Flat ₱100 shipping nationwide
        </div>
    );
}

function Footer() {
    return (
        <footer className="border-t bg-neutral-50">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
                <div>
                    <p className="text-lg font-bold">ABIIO SHOP</p>
                    <p className="mt-2 text-sm text-neutral-500">A portfolio demo store; payments are simulated.</p>
                </div>
                <FooterLinks title="Collections" items={COLLECTIONS} param="collection" />
                <FooterLinks title="Categories" items={CATEGORIES} param="category" />
            </div>
            <div className="border-t px-4 py-4 text-center text-xs text-neutral-400">
                <p>© {new Date().getFullYear()} ABIIO SHOP</p>
                <p className="mt-1">
                    Unofficial fan store. Not affiliated with The 1975, Dirty Hit, or any artist or label shown. Band names are used for
                    identification only.
                </p>
            </div>
        </footer>
    );
}

function FooterLinks({ title, items, param }: { title: string; items: Record<string, string>; param: string }) {
    return (
        <div>
            <p className="text-sm font-semibold">{title}</p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-500">
                {Object.entries(items).map(([key, label]) => (
                    <li key={key}>
                        <Link href={route('shop.index', { [param]: key })} className="hover:text-neutral-900">
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
