import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ORDER_STATUS } from '@/lib/catalog';
import { peso } from '@/lib/utils';
import type { BreadcrumbItem, Order } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PackageSearch } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: '/admin/orders' }];

interface Props {
    orders: Order[];
}

export default function Index({ orders }: Props) {
    const deliver = (id: string) => {
        if (confirm(`Mark order ${id} as delivered?`)) {
            router.put(route('orders.deliver', id), {}, { preserveScroll: true });
        }
    };

    const cancel = (id: string) => {
        if (confirm(`Cancel order ${id}? Its items will go back in stock.`)) {
            router.put(route('orders.adminCancel', id), {}, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />

            {orders.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center">
                    <PackageSearch className="mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No orders yet.</p>
                </div>
            ) : (
                <div className="m-4">
                    <Table>
                        <TableCaption>All customer orders, newest first.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Receiver</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                                <TableHead className="text-right">Shipping</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const status = ORDER_STATUS[order.order_status] ?? { label: order.order_status, className: '' };
                                return (
                                    <TableRow key={order.id} className="align-top transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <TableCell className="font-mono font-medium">{order.id}</TableCell>
                                        <TableCell>
                                            <ul className="text-sm">
                                                {order.cart.map((item) => (
                                                    <li key={item.product_id}>
                                                        {item.quantity} × {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="font-medium">{order.name}</div>
                                            <div className="text-gray-500">{order.phone}</div>
                                            <div className="max-w-xs whitespace-normal text-gray-500">{order.address}</div>
                                        </TableCell>
                                        <TableCell className={`font-semibold ${status.className}`}>{status.label}</TableCell>
                                        <TableCell className="text-right">{peso(order.subtotal)}</TableCell>
                                        <TableCell className="text-right">{peso(order.shipping_cost)}</TableCell>
                                        <TableCell className="text-right">{peso(order.total_cost)}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.order_status === 'paid' && (
                                                <Button onClick={() => deliver(order.id)} className="m-1 bg-green-600 hover:bg-green-700">
                                                    Mark as Delivered
                                                </Button>
                                            )}
                                            {(order.order_status === 'pending' || order.order_status === 'paid') && (
                                                <Button variant="ghost" onClick={() => cancel(order.id)} className="m-1 text-red-600">
                                                    Cancel
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}
