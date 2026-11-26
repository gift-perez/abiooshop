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
                <PackageSearch className="mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">No products found.</p>
            </div>
        );
    }

    return (
        <div className="m-4 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
                <Link href={route('shop.show', product.id)} className="text-black no-underline" key={product.id}>
                    <div className="m-4 h-125 w-90 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
                        <figure>
                            <img
                                src={imageUrl(product.image)}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full rounded-lg object-cover shadow"
                            />
                        </figure>
                        <div className="card-body m-4 items-center text-center">
                            <h2 className="card-title">{product.name}</h2>
                            <p>{product.description}</p>
                            <p className="font-bold text-green-600">{peso(product.price)}</p>
                            {product.stock < 1 && <p className="text-sm text-red-600">Out of stock</p>}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
