import ProductCards from '@/components/ui/productCards';
import StoreLayout from '@/layouts/store-layout';
import { CATEGORIES, COLLECTIONS } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface Props {
    products: Product[];
    filters: { category?: string; collection?: string };
}

export default function Index({ products, filters }: Props) {
    const title = [COLLECTIONS[filters.collection ?? ''], CATEGORIES[filters.category ?? '']].filter(Boolean).join(' · ') || 'All products';

    return (
        <StoreLayout>
            <Head title="Shop" />
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-neutral-500">
                {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>

            <div className="mt-6 mb-8 space-y-3">
                <FilterRow label="Collection" param="collection" options={COLLECTIONS} filters={filters} />
                <FilterRow label="Category" param="category" options={CATEGORIES} filters={filters} />
            </div>

            <ProductCards products={products} />
        </StoreLayout>
    );
}

function FilterRow({
    label,
    param,
    options,
    filters,
}: {
    label: string;
    param: 'category' | 'collection';
    options: Record<string, string>;
    filters: Props['filters'];
}) {
    const active = filters[param];
    // Changing one filter keeps the other one.
    const hrefFor = (value?: string) => route('shop.index', { ...filters, [param]: value });

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-sm text-neutral-500">{label}</span>
            <Chip href={hrefFor(undefined)} active={!active}>
                All
            </Chip>
            {Object.entries(options).map(([key, text]) => (
                <Chip key={key} href={hrefFor(key)} active={active === key}>
                    {text}
                </Chip>
            ))}
        </div>
    );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
    return (
        <Link
            href={href}
            preserveScroll
            className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 hover:border-neutral-900',
            )}
        >
            {children}
        </Link>
    );
}
