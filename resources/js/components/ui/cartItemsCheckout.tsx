import { imageUrl, peso } from '@/lib/utils';
import type { CartItem } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    cartItems: CartItem[];
}

export default function CartItemsCheckout({ cartItems }: Props) {
    return (
        <div>
            {cartItems.map((cartItem) => (
                <div
                    key={cartItem.product_id}
                    className="mb-4 flex items-center gap-4 rounded border p-4 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <Link href={route('shop.show', cartItem.product_id)}>
                        <figure className="h-24 w-24 flex-shrink-0">
                            <img src={imageUrl(cartItem.image)} alt={cartItem.name} className="h-full w-full rounded object-cover" />
                        </figure>
                    </Link>

                    <div className="ml-2 flex flex-1 justify-between">
                        <div className="flex flex-col justify-between">
                            <Link href={route('shop.show', cartItem.product_id)} className="font-semibold text-gray-800 hover:underline">
                                {cartItem.name}
                            </Link>
                            <p className="mt-2 text-sm text-gray-500">Quantity: {cartItem.quantity}</p>
                        </div>

                        <div className="mt-5 flex flex-col items-end text-sm text-gray-500">
                            <p>Price: {peso(cartItem.price)}</p>
                            <p>Subtotal: {peso(cartItem.subtotal)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
