
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, PackageOpen, PackageSearch, ShoppingBag, X } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './button';

interface OrderItem {
    id: number;
    cart: {
        product_id: number;
        image: string;
        name: string;
        quantity: number;
        price: number;
    };
    name: string;
    order_status: string;
    subtotal: number;
    shipping_cost: number;
    total_cost: number;
}

/**
 * Renders a list of order items or an empty bag message.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} [props.children] - Optional children to render.
 * @returns {JSX.Element} The rendered order items list or an empty state.
 *
 * @remarks
 * - Uses `usePage` to access the current order from page props.
 * - Displays each order item with image, name, quantity, price, and subtotal.
 * - Shows an empty bag message if there are no items in the order.
 */
export default function orderItems() {
    const { order } = usePage().props;

    const safeOrder = order ?? {};

    return (
        <div>
            {Object.entries(safeOrder).length > 0 ? (
            <>
                {Object.entries(safeOrder).map(([orderId, orderItem]) => {
                    const cart = orderItem.cart;

                        <div
                            key={cart.product_id}
                            className="card card-side bg-base-100 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-4 mb-4 p-4 rounded"
                        >
                            <Link href={`/shop/${cart.product_id}`} className="flex items-center w-full">
                                <figure className="w-24 h-24 flex-shrink-0">
                                    <img src={cart.image} alt={cart.name} className="w-full h-full object-cover rounded" />
                                </figure>
                                <div className="flex flex-1 items-center justify-between ml-4">
                                    {/* Name beside image */}
                                    <div className="font-semibold text-left">{cart.name}</div>
                                    {/* Details at the right */}
                                    <div className="text-sm text-gray-500 text-right space-y-1 min-w-[120px]">
                                        <p>Qty: {cart.quantity}x</p>
                                        <p>Price: ₱ {cart.price.toFixed(2)}</p>
                                        <p>Subtotal: ₱ {orderItem.subtotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                })}
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-64">
                <PackageOpen className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500">You don't have any orders yet</p>
            </div>
        )}
    </div>

    );
}
