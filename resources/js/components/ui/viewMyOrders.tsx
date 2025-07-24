import { usePage, Link } from "@inertiajs/react";
import { ReactNode } from "react";
import { Button } from "./button";
import CartItemsCheckout from "./cartItemsCheckout";

interface OrderItem {
    id: number;
    cart: JsonWebKey;
    name: string;
    order_status: string;
    subtotal: number;
    shipping_cost: number;
    total_cost: number;
}

export default function Summary({ children }: { children?: ReactNode }){
    const { order } = usePage().props;
        <div>
            <div className="text-3xl font-bold text-gray-800">
                order Summary
            </div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                    Total
                    <p className="text-l font-bold text-gray-800">
                        ₱ {total.toFixed(2)}
                    </p>
                </div>
            </div>
             <div className="divider"></div>
           <div className="flex justify-center">

                <div className="w-full">
                    <CartItemsCheckout />
                </div>
           </div>
        </div>

    )
}
