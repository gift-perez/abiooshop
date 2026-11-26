import { peso } from '@/lib/utils';
import type { Cart, CartItem } from '@/types';
import CartItemsCheckout from './cartItemsCheckout';

interface Props {
    cart: Cart;
    cartItems: CartItem[];
}

export default function SummaryCheckout({ cart, cartItems }: Props) {
    return (
        <div>
            <div className="text-3xl font-bold text-gray-800">Order Summary</div>
            <div className="divider"></div>
            <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                    Subtotal
                    <p>{peso(cart.subtotal)}</p>
                </div>
                <div className="flex justify-between">
                    Shipping fee
                    <p>{peso(cart.shipping_cost)}</p>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between text-sm text-gray-500">
                Total
                <p className="font-bold text-gray-800">{peso(cart.total_cost)}</p>
            </div>
            <div className="divider"></div>
            <CartItemsCheckout cartItems={cartItems} />
        </div>
    );
}
