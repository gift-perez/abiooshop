import CheckoutForm from '@/components/ui/checkoutForm';
import SummaryCheckout from '@/components/ui/summaryCheckout';
import StoreLayout from '@/layouts/store-layout';
import type { Cart, CartItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    cart: Cart;
    cartItems: CartItem[];
}

export default function Create({ cart, cartItems }: Props) {
    return (
        <StoreLayout>
            <Head title="Checkout" />
            <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
            <div className="flex w-full flex-col gap-8 lg:flex-row">
                <div className="flex flex-[2] items-start justify-center">
                    <div className="flex w-full max-w-2xl flex-col">
                        <CheckoutForm mode={cart.status === 'buy_now' ? 'buy_now' : 'cart'} />
                    </div>
                </div>
                <div className="flex flex-1 items-start justify-center">
                    <div className="w-full max-w-sm">
                        <SummaryCheckout cart={cart} cartItems={cartItems} />
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
