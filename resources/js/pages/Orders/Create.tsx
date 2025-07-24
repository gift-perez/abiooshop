import { type BreadcrumbItem } from '@/types';
import React, { ReactNode, useState } from 'react';
import { Navbar } from '@/components/ui/navbar';
import SummaryCheckout from '@/components/ui/summaryCheckout';
import CheckoutForm from '@/components/ui/checkoutForm';
import type { Cart, CartItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finalize Order',
        href: '/checkout',
    },
];

interface Props {
  cart: Cart;
  cartItems: CartItem[];
}

export default function Index({ cart, cartItems }: Props ) {
    return (
        <>
            <Navbar cart = {cart} />
            <div className="flex w-full flex-col gap-8 lg:flex-row m-4">
                <div className="flex-[2] flex items-start justify-center m-8">
                    <div className="w-full max-w-2xl flex flex-col">
                        <span><CheckoutForm cart={cart} cartItems={cartItems} />
                        </span>

                    </div>
                </div>
                <div className="flex-1 flex items-start justify-center m-8">
                    <div className="w-full max-w-sm">
                        <SummaryCheckout cart={cart} cartItems={cartItems}/>
                    </div>
                </div>
            </div>
        </>
    );
}
