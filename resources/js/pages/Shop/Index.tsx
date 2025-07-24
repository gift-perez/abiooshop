import { Navbar } from '@/components/ui/navbar';
import ProductCards from '@/components/ui/productCards';
import type { Cart, CartItem, Product } from '@/types';
import { PageProps } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface Props {
    cart: Cart;
    cartItems: CartItem[];
    products: Product[];
}

interface CustomPageProps extends PageProps {
    flash?: {
        message?: string;
    };
    [key: string]: any;
}

export default function Index({ cart, cartItems, products }: Props) {
    const { props } = usePage();

    useEffect(() => {
        if (props.flash?.message) {
            toast.success(props.flash.message);
        }
    }, [props.flash]);

    return (
        <>
            <Navbar cart={cart} />
            <Toaster richColors position="bottom-right" />

            <Head title="Shop" />

            <ProductCards products={products} />
        </>
    );
}
