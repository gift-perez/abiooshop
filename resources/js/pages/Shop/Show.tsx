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
import { Navbar } from '@/components/ui/navbar';
import ProductCards from '@/components/ui/productCards';
import { imageUrl, peso } from '@/lib/utils';
import type { Product } from '@/types';
import { Head, router } from '@inertiajs/react';
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
        <>
            <Head title={product.name} />
            <Navbar />

            <div className="hero bg-base-200 max-h-screen overflow-hidden">
                <div className="hero-content m-10 flex flex-col gap-10 lg:flex-row">
                    <div className="w-full lg:w-1/2">
                        <img src={imageUrl(product.image)} alt={product.name} className="h-90 w-90 rounded-lg object-cover shadow" />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h1 className="mb-2 text-4xl font-bold">{product.name.toUpperCase()}</h1>
                        <p className="mb-4 text-gray-500">{product.description}</p>
                        <p className="mb-2 text-xl font-bold text-green-600">{peso(product.price)}</p>
                        <p className="mb-4 text-sm text-gray-600">{outOfStock ? 'Out of stock' : `Stock: ${product.stock}`}</p>

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

                        <div className="mt-4 flex gap-2">
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

            <div className="mt-4 flex flex-col gap-4">
                {collectionProducts.length > 0 && (
                    <div className="m-4 gap-4">
                        <h2 className="mx-6 text-xl font-bold text-gray-800">More from this collection</h2>
                        <ProductCards products={collectionProducts} />
                    </div>
                )}
                {categoryProducts.length > 0 && (
                    <div className="m-4 gap-4">
                        <h2 className="mx-6 text-xl font-bold text-gray-800">More in this category</h2>
                        <ProductCards products={categoryProducts} />
                    </div>
                )}
            </div>
        </>
    );
}
