import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { ORDER_STATUS } from '@/lib/catalog';
import { imageUrl, peso } from '@/lib/utils';
import type { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PackageSearch } from 'lucide-react';

interface Props {
    orders: Order[];
}

export default function UserOrders({ orders }: Props) {
    const markReceived = (id: string) => {
        if (confirm(`Confirm that you received order ${id}?`)) {
            router.put(route('orders.complete', id), {}, { preserveScroll: true });
        }
    };

    const cancel = (id: string) => {
        if (confirm(`Cancel order ${id}? Reserved items will go back in stock.`)) {
            router.put(route('orders.cancel', id), {}, { preserveScroll: true });
        }
    };

    return (
        <StoreLayout>
            <Head title="My Orders" />
            <h1 className="mx-auto mb-6 max-w-3xl text-3xl font-bold">My orders</h1>

            {orders.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center">
                    <PackageSearch className="mb-4 h-12 w-12 text-gray-400" />
                    <p className="mb-4 text-gray-500">You don't have any orders yet.</p>
                    <Link href={route('shop.index')}>
                        <Button variant="outline">Start shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="mx-auto flex max-w-3xl flex-col gap-4">
                    {orders.map((order) => {
                        const status = ORDER_STATUS[order.order_status] ?? { label: order.order_status, className: 'text-gray-700' };

                        return (
                            <div key={order.id} className="rounded border p-4 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                    <div className="flex flex-col gap-3">
                                        {order.cart.map((item) => (
                                            <div key={item.product_id} className="flex items-center gap-4">
                                                <img src={imageUrl(item.image)} alt={item.name} className="h-16 w-16 rounded object-cover" />
                                                <div className="text-left">
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {item.quantity} × {peso(item.price)} = {peso(item.subtotal)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <dl className="grid grid-cols-[auto_auto] content-start gap-x-4 gap-y-1 text-sm sm:text-right">
                                        <dt className="text-gray-500">Order ID</dt>
                                        <dd className="font-mono">{order.id}</dd>
                                        <dt className="text-gray-500">Status</dt>
                                        <dd className={`font-semibold ${status.className}`}>{status.label}</dd>
                                        <dt className="text-gray-500">Total</dt>
                                        <dd className="font-semibold text-cyan-700">{peso(order.total_cost)}</dd>
                                    </dl>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    {order.order_status === 'pending' && (
                                        <>
                                            <Button variant="ghost" onClick={() => cancel(order.id)}>
                                                Cancel
                                            </Button>
                                            <Link href={route('orders.payment', order.id)}>
                                                <Button>Proceed to payment</Button>
                                            </Link>
                                        </>
                                    )}
                                    {order.order_status === 'delivered' && <Button onClick={() => markReceived(order.id)}>Order received</Button>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </StoreLayout>
    );
}
