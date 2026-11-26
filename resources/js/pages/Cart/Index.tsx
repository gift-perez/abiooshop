import CartItems from '@/components/ui/cartItems';
import { Navbar } from '@/components/ui/navbar';
import Summary from '@/components/ui/summaryCart';
import type { Cart, CartItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    cart: Cart;
    cartItems: CartItem[];
}

export default function Index({ cart, cartItems }: Props) {
    return (
        <>
            <Head title="Cart" />
            <Navbar />
            <div className="m-4 flex w-full flex-col gap-8 lg:flex-row">
                <div className="grow">
                    <CartItems cartItems={cartItems} />
                </div>
                {cartItems.length > 0 && (
                    <div className="m-4 w-full lg:m-16 lg:w-80">
                        <Summary cart={cart} />
                    </div>
                )}
            </div>
        </>
    );
}
