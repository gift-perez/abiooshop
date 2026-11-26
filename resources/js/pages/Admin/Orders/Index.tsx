import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ORDER_STATUS } from '@/lib/catalog';
import { peso } from '@/lib/utils';
import type { BreadcrumbItem, Order } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { PackageSearch } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Orders', href: '/admin/orders' }];

interface Props {
    orders: Order[];
    cancelReasons: Record<string, string>;
}

export default function Index({ orders, cancelReasons }: Props) {
    const [cancelling, setCancelling] = useState<Order | null>(null);

    const deliver = (id: string) => {
        if (confirm(`Mark order ${id} as delivered?`)) {
            router.put(route('orders.deliver', id), {}, { preserveScroll: true });
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
                                        <TableCell>
                                            <div className={`font-semibold ${status.className}`}>{status.label}</div>
                                            {order.cancellation_reason_label && (
                                                <div className="max-w-48 text-xs whitespace-normal text-gray-500">
                                                    {order.cancellation_reason_label}
                                                </div>
                                            )}
                                        </TableCell>
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
                                                <Button variant="ghost" onClick={() => setCancelling(order)} className="m-1 text-red-600">
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

            <CancelOrderDialog order={cancelling} reasons={cancelReasons} onClose={() => setCancelling(null)} />
        </AppLayout>
    );
}

/** Store-side cancellation always needs a reason; the customer sees it in Order tracking. */
function CancelOrderDialog({ order, reasons, onClose }: { order: Order | null; reasons: Record<string, string>; onClose: () => void }) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({ reason: '' });

    const close = () => {
        reset();
        clearErrors();
        onClose();
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!order) return;
        put(route('orders.adminCancel', order.id), { preserveScroll: true, onSuccess: close });
    };

    return (
        <Dialog open={order !== null} onOpenChange={(open) => !open && close()}>
            <DialogContent>
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Cancel order {order?.id}?</DialogTitle>
                        <DialogDescription>
                            Its items go back in stock.
                            {order?.order_status === 'paid' && ' The order is paid, so the payment will be marked as refunded (demo).'} The customer
                            will see the reason you choose.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-1.5">
                        <Select value={data.reason} onValueChange={(value) => setData('reason', value)}>
                            <SelectTrigger aria-label="Cancellation reason">
                                <SelectValue placeholder="Choose a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(reasons).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.reason} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={close}>
                            Keep order
                        </Button>
                        <Button type="submit" variant="destructive" disabled={processing || !data.reason}>
                            {processing ? 'Cancelling...' : 'Cancel order'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
