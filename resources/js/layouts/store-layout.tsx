import { Navbar } from '@/components/ui/navbar';
import { CATEGORIES, COLLECTIONS } from '@/lib/catalog';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

/** Shared frame for every storefront page: sticky navbar, centred content, footer. */
export default function StoreLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-neutral-900">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer className="border-t bg-neutral-50">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
                <div>
                    <p className="text-lg font-bold">ABIIO SHOP</p>
                    <p className="mt-2 text-sm text-neutral-500">Band merch for fans. A portfolio demo store; payments are simulated.</p>
                </div>
                <FooterLinks title="Collections" items={COLLECTIONS} param="collection" />
                <FooterLinks title="Categories" items={CATEGORIES} param="category" />
            </div>
            <p className="border-t py-4 text-center text-xs text-neutral-400">© {new Date().getFullYear()} ABIIO SHOP</p>
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
