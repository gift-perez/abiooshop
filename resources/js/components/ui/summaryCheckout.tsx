import { usePage, Link } from "@inertiajs/react";
import { ReactNode } from "react";
import { Button } from "./button";
import CartItemsCheckout from "./cartItemsCheckout";
import type { Cart, CartItem } from '@/types';

interface Props {
  cart: Cart;
  cartItems: CartItem[];
}

export default function Summary({ cart, cartItems }: Props){
  if (!cart) {
    return <div>Loading summary...</div>;
  }

    return(
        <div>
            <div className="text-3xl font-bold text-gray-800">
                Cart Summary
            </div>
            <div className="divider"></div>
            <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                    Subtotal
                    <p>
                    ₱  {cart.subtotal}
                    </p>
                </div>
                <div className="flex justify-between">
                    Shipping fee
                    <p>
                        ₱ 100.00
                    </p>
                </div>
            </div>
            <div className="divider"></div>
            <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                    Total
                    <p className="text-l font-bold text-gray-800">
                        ₱ {cart.total_cost}
                    </p>
                </div>
            </div>
             <div className="divider"></div>
           <div className="flex justify-center">

                <div className="w-full">
                    <CartItemsCheckout cart={cart} cartItems={cartItems} />
                </div>
           </div>
        </div>

    )
}
