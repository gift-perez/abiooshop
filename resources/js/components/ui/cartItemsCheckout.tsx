import { Link } from '@inertiajs/react';
import React from 'react';
import type { Cart, CartItem } from '@/types';

interface Props {
  cart: Cart;
  cartItems: CartItem[];
}

export default function CartItemsCheckout({ cart, cartItems }: Props) {
  return (
    <div>
      {cartItems.map(cartItem => (
        <div
          key={cartItem.id}
          className="flex items-center gap-4 mb-4 p-4 border rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {/* Product image */}
          <Link href={`/shop/${cartItem.product_id}`}>
            <figure className="w-24 h-24 flex-shrink-0">
              <img src={cartItem.image} alt={cartItem.name} className="w-full h-full object-cover rounded" />
            </figure>
          </Link>

          {/* Details wrapper */}
          <div className="flex flex-1 justify-between ml-2">
            {/* Middle: name and quantity */}
            <div className="flex flex-col justify-between">
              <Link href={`/shop/${cartItem.product_id}`} className="font-semibold text-gray-800 hover:underline">
                {cartItem.name}
              </Link>
              <p className="mt-2 text-sm text-gray-500">Quantity: {cartItem.quantity}</p>
            </div>

            {/* Prices */}
            <div className="flex flex-col items-end text-sm text-gray-500 mt-5">
              <p>Price: ₱ {cartItem.price.toFixed(2)}</p>
              <p>Subtotal: ₱ {cartItem.subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
