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
import { Toaster } from '@/components/ui/sonner';
import type { Cart } from '@/types';
import { type BreadcrumbItem, SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, MessageSquareWarning, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
}

interface Props {
    product: Product;
    product_id: number;
    quantity: number;
    cart: Cart;
    collectionProducts: Product[];
    categoryProducts: Product[];
}

export default function Show({ cart, product, collectionProducts, categoryProducts }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'View Product',
            href: `/shop/${product.id}`,
        },
    ];

    const { auth } = usePage<SharedData>().props;

    const { data, setData } = useForm({
        product_id: product.id,
        quantity: '1',
    });

    const [loading, setLoading] = useState(false);

    const handleAddToCart = () => {
        setLoading(true);

        if (auth.user) {
            router.post(
                '/cart/add',
                { product_id: product.id, quantity: data.quantity },
                {
                    onFinish: (): void => setLoading(false),
                    onSuccess: (): void => {
                        toast(
                            <span>
                                <ShoppingBag /> Product added to cart
                            </span>,
                        );
                    },
                    onError: (errors): void => alert(errors.product_id || 'Something went wrong!'),
                },
            );
        } else {
            router.post(
                '/cart/session/add',
                { product_id: product.id, quantity: data.quantity },
                {
                    onFinish: (): void => setLoading(false),
                    onSuccess: (): void => {
                        toast(
                            <span>
                                <ShoppingBag /> Product added to cart
                            </span>,
                        );
                    },
                    onError: (errors): void => alert(errors.product_id || 'Something went wrong!'),
                },
            );
        }
    };

    const handleBuyNow = () => {
        router.post(
            '/buy-now',
            {
                product_id: product.id,
                quantity: data.quantity,
            },
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    // Optional toast if you want
                    toast.success('Proceeding to checkout...');
                },
                onError: (errors) => {
                    toast.error(errors.product_id || 'Something went wrong!');
                },
            },
        );
    };

    const numericQuantity = parseInt(data.quantity, 10);
    const showWarning = !isNaN(numericQuantity) && numericQuantity > product.stock;
    const disableAddToCart = showWarning || numericQuantity < 1;

    return (
        <>
            <Navbar cart={cart} />
            <Toaster />

            <div className="hero max-h-screen overflow-hidden bg-base-200">
                {/* <Banners /> */}
                <div className="hero-content m-10 flex flex-col gap-10 lg:flex-row">
                    <div className="w-full lg:w-1/2">
                        <img src={`../${product.image}`} alt={product.name} className="h-90 w-90 rounded-lg object-cover shadow" />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <h1 className="mb-2 text-4xl font-bold">{product.name.toUpperCase()}</h1>
                        <p className="mb-4 text-gray-500">{product.description}</p>
                        <p className="mb-2 text-xl font-bold text-green-600">₱ {product.price.toFixed(2)}</p>
                        <p className="mb-4 text-sm text-gray-600">Stock: {product.stock}</p>

                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            {product.stock <= 10 ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            {data.quantity || 1} <ChevronDown />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="mx-2 w-48" side="bottom">
                                        <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup
                                            value={data.quantity.toString() || '1'}
                                            onValueChange={(value) => setData('quantity', value)}
                                        >
                                            {Array.from({ length: product.stock }, (_, i) => {
                                                const value = i + 1;
                                                return (
                                                    <DropdownMenuRadioItem key={value} value={value.toString()}>
                                                        {value}
                                                    </DropdownMenuRadioItem>
                                                );
                                            })}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <input
                                    type="number"
                                    min={1}
                                    max={product.stock}
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-24 rounded border p-2"
                                    placeholder="Quantity"
                                />
                            )}
                        </div>

                        {showWarning && (
                            <Alert variant="destructive" className="mt-2">
                                <MessageSquareWarning className="h-4 w-4" />
                                <AlertDescription>You have exceeded available stock ({product.stock}). Please adjust.</AlertDescription>
                            </Alert>
                        )}

                        <div className="mt-4 flex gap-2">
                            <Button variant="outline" onClick={handleAddToCart} disabled={loading || disableAddToCart} className="w-full">
                                {loading ? (
                                    <span
                                        className="loading loading-lg loading-ring"
                                        style={{ color: '#1ad6db', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    ></span>
                                ) : (
                                    'Add to Cart'
                                )}
                            </Button>
                            <Button onClick={handleBuyNow} disabled={disableAddToCart} className="w-full">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
                <div className="m-4 gap-4">
                    <h1 className={'mx-6 text-xl font-bold text-gray-800'}>Products from Collection</h1>
                    <ProductCards products={collectionProducts} />
                </div>
                <div className="m-4 gap-4">
                    <h1 className={'mx-6 text-xl font-bold text-gray-800'}>Products from Category</h1>
                    <ProductCards products={categoryProducts} />
                </div>
            </div>
        </>
    );
}
