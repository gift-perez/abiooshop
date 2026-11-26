import { COLLECTIONS } from '@/lib/catalog';
import { imageUrl, peso } from '@/lib/utils';
import type { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { PackageSearch } from 'lucide-react';

interface Props {
    products: Product[];
}

export default function ProductCards({ products }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center">
                <PackageSearch className="mb-4 h-12 w-12 text-neutral-400" />
                <p className="font-display text-2xl">Nothing here (yet)</p>
                <p className="mt-1 text-sm text-neutral-500">Try another collection or category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
                const outOfStock = product.stock < 1;
                return (
                    <Link
                        href={route('shop.show', product.id)}
                        key={product.id}
                        className="group flex flex-col overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
                    >
                        <div className="relative aspect-square overflow-hidden bg-neutral-100">
                            <img
                                src={imageUrl(product.image)}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {outOfStock && (
                                <span className="absolute top-2 left-2 rounded bg-neutral-900/80 px-2 py-0.5 text-xs font-medium text-white">
                                    Sold out
                                </span>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                            <p className="text-xs tracking-wide text-neutral-500 uppercase">{COLLECTIONS[product.collection] ?? product.collection}</p>
                            <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
                            <p className="line-clamp-2 text-sm text-neutral-500">{product.description}</p>
                            <p className="mt-auto pt-2 font-bold">{peso(product.price)}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
