import CheckoutForm from '@/components/ui/checkoutForm';
import { Navbar } from '@/components/ui/navbar';
import SummaryCheckout from '@/components/ui/summaryCheckout';
import type { Cart, CartItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    cart: Cart;
    cartItems: CartItem[];
}

export default function Create({ cart, cartItems }: Props) {
    return (
        <>
            <Head title="Checkout" />
            <Navbar />
            <div className="m-4 flex w-full flex-col gap-8 lg:flex-row">
                <div className="m-8 flex flex-[2] items-start justify-center">
                    <div className="flex w-full max-w-2xl flex-col">
                        <CheckoutForm mode={cart.status === 'buy_now' ? 'buy_now' : 'cart'} />
                    </div>
                </div>
                <div className="m-8 flex flex-1 items-start justify-center">
                    <div className="w-full max-w-sm">
                        <SummaryCheckout cart={cart} cartItems={cartItems} />
                    </div>
                </div>
            </div>
        </>
    );
}
