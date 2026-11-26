import CartItems from '@/components/ui/cartItems';
import Summary from '@/components/ui/summaryCart';
import StoreLayout from '@/layouts/store-layout';
import type { Cart, CartItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    cart: Cart;
    cartItems: CartItem[];
}

export default function Index({ cart, cartItems }: Props) {
    return (
        <StoreLayout>
            <Head title="Cart" />
            <div className="flex w-full flex-col gap-8 lg:flex-row">
                <div className="min-w-0 grow">
                    <CartItems cartItems={cartItems} />
                </div>
                {cartItems.length > 0 && (
                    <div className="w-full lg:w-80 lg:shrink-0">
                        <Summary cart={cart} />
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
