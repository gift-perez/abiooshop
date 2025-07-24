import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Navbar } from '@/components/ui/navbar';
import type { Cart } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Megaphone, PackageSearch } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    id: number;
    cart: Record<string, any> | string;
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

interface Props {
    cart: Cart;
}

export default function Index({ cart }: Props) {
    const { orders, flash } = usePage().props as unknown as Pageprops;
    const { processing } = useForm();

    function handleComplete(id: number): void {
        if (confirm(`Are you sure you want to confirm that the order with id - "${id}" is complete?`)) {
            router.put(`/orders/${id}/complete`, { id });
            toast('Order successfully completed');
        }
    }
    function isDelivered(order: { order_status: string; id: number }) {
        if (order.order_status === 'delivered') {
            return (
                <button className="btn btn-warning" disabled={processing} onClick={() => handleComplete(order.id)}>
                    Order Received
                </button>
            );
        }
    }

    function handlePayment(id: number): void {
        if (confirm(`Are you sure you want to pay the order with id - "${id}" ?`)) {
            router.get(`/orders/payment/${id}`, { id });
            toast('Proceed to Payment');
        }
    }
    function isPending(order: { order_status: string; id: number }) {
        if (order.order_status === 'pending') {
            return (
                <button className="btn btn-warning" disabled={processing} onClick={() => handlePayment(order.id)}>
                    Proceed to Payment
                </button>
            );
        }
    }
    return (
        <>
            <Navbar cart={cart} />
            <div className="m-4">
                {flash.message && (
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>
            {/* <div>
                    Object.entries(orders).map(([orderId, orderItem]) => {
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
                                    Name beside image
                                    <div className="font-semibold text-left">{cart.name}</div>
                                    Details at the right
                                    <div className="text-sm text-gray-500 text-right space-y-1 min-w-[120px]">
                                        <p>Qty: {cart.quantity}x</p>
                                        <p>Price: ₱ {cart.price.toFixed(2)}</p>
                                        <p>Subtotal: ₱ {orderItem.subtotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                })}
                </div> */}
            {/* {orders.length > 0 ? (
                    {orders.map((order) => (
                        <div
                            key={order.order_id}
                            className="card card-side bg-base-100 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-4 mb-4 p-4 rounded"
                        >
                            // <Link href={`/shop/${cart.product_id}`} className="flex items-center w-full">
                                // <figure className="w-24 h-24 flex-shrink-0">
                                //     <img src={cart.image} alt={cart.name} className="w-full h-full object-cover rounded" />
                                // </figure>
                                // <div className="flex flex-1 items-center justify-between ml-4">
                                //     Name beside image
                                //     <div className="font-semibold text-left">{cart.name}</div>
                                //     Details at the right
                                //     <div className="text-sm text-gray-500 text-right space-y-1 min-w-[120px]">
                                //         <p>Qty: {cart.quantity}x</p>
                                //         <p>Price: ₱ {cart.price.toFixed(2)}</p>
                                //         <p>Subtotal: ₱ {orderItem.subtotal.toFixed(2)}</p>
                                //     </div>
                                // </div>
                            // </Link>
                         ))} */}

            {orders.length > 0 ? (
                <div className="m-4 flex flex-col items-center">
                    {orders.map((order, idx) => {
                        // Parse cart
                        let cartObj: Record<string, any> = typeof order.cart === 'string' ? JSON.parse(order.cart) : order.cart;

                        return (
                            <div key={order.id}>
                                <div className="m-4 flex flex-row items-center text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <div className="mx-auto flex max-w-xs flex-col items-center justify-center whitespace-nowrap">
                                        {Object.entries(cartObj).map(([productId, item]: [string, any]) => {
                                            return (
                                                <div key={productId} className="m-4 mb-2 flex items-center justify-center gap-4">
                                                    <figure className="h-16 w-16 flex-shrink-0">
                                                        <img
                                                            src={`../${item.image}`}
                                                            alt={item.name}
                                                            className="h-full w-full rounded object-cover"
                                                        />
                                                    </figure>
                                                    <div className="m-4 flex-1 text-left">
                                                        <div className="font-semibold">{item.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Qty: {item.quantity}x<br />
                                                            Price: ₱ {item.price.toFixed(2)}
                                                            <br />
                                                            Subtotal: ₱ {item.subtotal.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="justify-right mt-4 flex w-full flex-row font-semibold">
                                        <div className="m-2 mb-2 flex flex-col items-end justify-end">
                                            <span>Order ID:</span>
                                            <span>Status:</span>
                                            <span>Total:</span>
                                        </div>
                                        <div className="m-2 mb-2 flex flex-col items-end justify-end">
                                            <span>{order.id}</span>
                                            <span
                                                className={`${
                                                    order.order_status === 'delivered'
                                                        ? 'text-blue-600'
                                                        : order.order_status === 'pending'
                                                          ? 'text-yellow-600'
                                                          : order.order_status === 'completed'
                                                            ? 'text-green-800'
                                                            : order.order_status === 'approved'
                                                              ? 'text-green-600'
                                                              : order.order_status === 'cancelled'
                                                                ? 'text-red-600'
                                                                : order.order_status === ''
                                                                  ? 'text-red-600'
                                                                  : 'text-gray-700'
                                                }`}
                                            >
                                                {order.order_status}
                                            </span>
                                            <span className="text-cyan-700">₱ {order.total_cost}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="flex justify-end">{isDelivered(order)}</span>
                                <span className="flex justify-end">{isPending(order)}</span>
                                <div className="divider"></div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center">
                    <PackageSearch className="mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No orders found.</p>
                </div>
            )}
        </>
    );
}
