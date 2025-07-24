import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Megaphone, PackageSearch } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/orders',
    },
];

interface Order {
    id: number;
    cart: JsonWebKey;
    name: string;
    order_status: string;
    subtotal: number;
    shipping_cost: number;
    total_cost: number;
}

interface Pageprops {
    flash: {
        message?: string;
    };
    orders: Order[];
}

export default function Index() {
    const { orders, flash } = usePage().props as unknown as Pageprops;
    const { processing, delete: inertiaDelete } = useForm();

    const handleConfirm = (id: number) => {
        //alert("Do you want to delete the " + name + " order?");

        if (confirm(`Are you sure you want to confirm the order with id - "${id}"?`)) {
            // Perform the delete action
            inertiaDelete(`/orders/${id}/delete`);
        }
    };

    function handleApprove(id: number): void {
        if (confirm(`Are you sure you want to approve the order with id - "${id}"?`)) {
            router.put(`/orders/${id}/approve`, { id });
            toast('Order successfully approved');
        }
    }

    function handleDelete(id: number): void {
        if (confirm(`Are you sure you want to delete the order with id - "${id}"?`)) {
            router.put(`/orders/${id}/destroy`, { id });
            toast('Order successfully deleted');
        }
    }

    function handleDeliver(id: number): void {
        if (confirm(`Are you sure you want the order with id - "${id}" to be marked as delivered?`)) {
            router.put(`/orders/${id}/deliver`, { id });
            toast('Order successfully deliver');
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="orders" />
            <div className="m-4">{/* <Link href={route('orders.create')} ><Button>Create a order</Button></Link> */}</div>
            <div className="m-4">
                {flash.message && (
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>
            {orders.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>A list of the orders in the database.</TableCaption>
                        <TableHeader>
                            <TableRow className="space-x-2 text-center">
                                <TableHead className="w-[100px] text-center">Order ID</TableHead>
                                <TableHead className="text-center">Order Details</TableHead>
                                <TableHead className="text-center">Receiver Name</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Subtotal</TableHead>
                                <TableHead className="text-center">Shipping Cost</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} className="text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>
                                        <div className="max-w-xs overflow-x-auto whitespace-nowrap">{JSON.stringify(order.cart)}</div>
                                    </TableCell>
                                    <TableCell>{order.name}</TableCell>
                                    <TableCell>{order.order_status}</TableCell>
                                    <TableCell> ₱ {order.subtotal.toFixed(2)}</TableCell>
                                    <TableCell> ₱ {order.shipping_cost.toFixed(2)}</TableCell>
                                    <TableCell> ₱ {order.total_cost.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {order.order_status === 'pending' && (
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleApprove(order.id)}
                                                className="m-2 bg-blue-500 hover:bg-blue-700"
                                            >
                                                Approve
                                            </Button>
                                        )}

                                        {order.order_status === 'paid' && (
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleDeliver(order.id)}
                                                className="m-2 bg-green-500 hover:bg-green-700"
                                            >
                                                Mark as Delivered
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center">
                    <PackageSearch className="mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No orders found.</p>
                </div>
            )}
        </AppLayout>
    );
}
