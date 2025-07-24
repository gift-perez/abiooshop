import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Cart, CartItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Navbar } from '@/components/ui/navbar';
import CartItems from '@/components/ui/cartItems';
import Summary from '@/components/ui/summaryCart';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Finalize Order',
        href: '/mycart',
    },
];


interface Props {
  cart: Cart;
  cartItems: CartItem[];
}



export default function Index({ cart, cartItems }: Props    ) {
    const { props } = usePage();
    const error = props.flash?.error;
    const success = props.flash?.success;
    return (
        <>
        {error && (
        <div>
            <span><div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}
            <Link
            href="/shop"
            className="inline-flex items-center text-sm text-blue-600 hover:underline font-medium m-2"
            >
            Go back to shop
            </Link></span>
            </div></span>

        </div>
        )}
        {success && (
            <div className="toast toast-end">
            <div className="alert alert-success">
                <span>{success}</span>
            </div>
            </div>
        )}
        <Navbar cart = {cart}/>
        <div className="flex w-full flex-col lg:flex-row m-4">
                <div className="grid h-32 grow place-items-center">
                    <CartItems cart={cart} cartItems={cartItems} />

                </div>
                <div className="grid h-32 w-32 grow place-items-left m-16">
                    <Summary cart={cart} />
                </div>
        </div>
        </>
    );
}
