import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProductCards from '@/components/ui/productCards';
import StoreLayout from '@/layouts/store-layout';
import { CATEGORIES, COLLECTIONS } from '@/lib/catalog';
import { imageUrl, peso } from '@/lib/utils';
import type { Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, MessageSquareWarning } from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: Product;
    collectionProducts: Product[];
    categoryProducts: Product[];
}

export default function Show({ product, collectionProducts, categoryProducts }: Props) {
    const [quantity, setQuantity] = useState('1');
    const [loading, setLoading] = useState(false);

    const numericQuantity = parseInt(quantity, 10);
    const outOfStock = product.stock < 1;
    const showWarning = !isNaN(numericQuantity) && numericQuantity > product.stock;
    const disabled = outOfStock || showWarning || isNaN(numericQuantity) || numericQuantity < 1;

    const submit = (url: string) => {
        router.post(
            url,
            { product_id: product.id, quantity: numericQuantity },
            {
                preserveScroll: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <StoreLayout>
            <Head title={product.name} />

            <nav className="mb-6 text-sm text-neutral-500">
                <Link href={route('shop.index')} className="hover:text-neutral-900">
                    Shop
                </Link>
                {' / '}
                <Link href={route('shop.index', { collection: product.collection })} className="hover:text-neutral-900">
                    {COLLECTIONS[product.collection] ?? product.collection}
                </Link>
                {' / '}
                <span className="text-neutral-900">{product.name}</span>
            </nav>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                <div className="aspect-square overflow-hidden rounded-xl border bg-neutral-100">
                    <img src={imageUrl(product.image)} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm tracking-wide text-neutral-500 uppercase">
                        {COLLECTIONS[product.collection] ?? product.collection} · {CATEGORIES[product.category] ?? product.category}
                    </p>
                    <h1 className="mt-1 font-display text-4xl lg:text-5xl">{product.name}</h1>
                    <p className="mt-4 text-2xl font-bold">{peso(product.price)}</p>
                    <p className={`mt-1 text-sm ${outOfStock ? 'text-red-600' : 'text-neutral-500'}`}>
                        {outOfStock ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
                    </p>
                    <p className="mt-6 leading-relaxed text-neutral-600">{product.description}</p>
                    <div className="mt-8">
                        {!outOfStock && (
                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-sm text-gray-600">Quantity:</span>
                                {product.stock <= 10 ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                {quantity} <ChevronDown />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="mx-2 w-48" side="bottom">
                                            <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuRadioGroup value={quantity} onValueChange={setQuantity}>
                                                {Array.from({ length: product.stock }, (_, i) => (
                                                    <DropdownMenuRadioItem key={i + 1} value={String(i + 1)}>
                                                        {i + 1}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <input
                                        type="number"
                                        min={1}
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-24 rounded border p-2"
                                        aria-label="Quantity"
                                    />
                                )}
                            </div>
                        )}

                        {showWarning && (
                            <Alert variant="destructive" className="mt-2">
                                <MessageSquareWarning className="h-4 w-4" />
                                <AlertDescription>Only {product.stock} in stock. Please lower the quantity.</AlertDescription>
                            </Alert>
                        )}

                        <div className="mt-6 flex gap-2">
                            <Button variant="outline" onClick={() => submit(route('cart.add'))} disabled={loading || disabled} className="w-full">
                                Add to Cart
                            </Button>
                            <Button onClick={() => submit(route('buy.now'))} disabled={loading || disabled} className="w-full">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {collectionProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="mb-6 font-display text-3xl">More from {COLLECTIONS[product.collection] ?? 'this collection'}</h2>
                    <ProductCards products={collectionProducts} />
                </section>
            )}
            {categoryProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="mb-6 font-display text-3xl">More {CATEGORIES[product.category]?.toLowerCase() ?? 'in this category'}</h2>
                    <ProductCards products={categoryProducts} />
                </section>
            )}
        </StoreLayout>
    );
}
