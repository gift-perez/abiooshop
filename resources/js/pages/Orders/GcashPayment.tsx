import { peso } from '@/lib/utils';
import type { Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
    order: Order;
}

/**
 * DEMO payment screen styled after a GCash checkout.
 * No real gateway is involved: the buttons ask the server to mark the
 * order as paid or to simulate a failed payment.
 */
export default function GcashPayment({ order }: Props) {
    const [processing, setProcessing] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(5);
    const isPaid = order.order_status === 'paid';

    // After a successful payment, count down and return to "My orders".
    useEffect(() => {
        if (!isPaid) return;
        if (secondsLeft <= 0) {
            router.visit(route('orders.showOrders'));
            return;
        }
        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [isPaid, secondsLeft]);

    const simulate = (result: 'paid' | 'failed') => {
        router.post(
            route('orders.pay', order.id),
            { result },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const cancel = () => {
        if (confirm('Cancel this order? Reserved items will go back in stock.')) {
            router.put(route('orders.cancel', order.id)); // server redirects to "My orders"
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0057e2] p-4">
            <Head title="Payment" />

            <div className="mb-4 w-full max-w-md rounded bg-yellow-100 px-4 py-2 text-center text-sm text-yellow-900">
                <strong>Demo checkout.</strong> This is not real GCash. No money is charged.
            </div>

            <div className="w-full max-w-md rounded bg-white p-8 text-center shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-[#0057e2]">GCash</h1>

                <div className="mb-6 rounded bg-gray-100 p-4 text-left">
                    <div className="mb-2 flex justify-between">
                        <span className="text-gray-500">Merchant</span>
                        <span className="font-medium">ABIIO SHOP</span>
                    </div>
                    <div className="mb-2 flex justify-between gap-4">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-mono font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount Due</span>
                        <span className="font-medium text-[#0057e2]">{peso(order.total_cost)}</span>
                    </div>
                </div>

                {isPaid ? (
                    <div className="flex flex-col items-center">
                        <svg className="mb-4 h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="mb-2 font-bold text-green-600">Payment Successful!</p>
                        <Link
                            href={route('orders.showOrders')}
                            className="mb-2 w-full rounded bg-[#0057e2] px-4 py-2 text-white hover:bg-[#0046b0]"
                        >
                            Return to Merchant
                        </Link>
                        <p className="text-gray-600">
                            Redirecting in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            disabled={processing}
                            onClick={() => simulate('paid')}
                            className="w-full rounded bg-[#0057e2] px-4 py-2 text-white hover:bg-[#0046b0] disabled:opacity-60"
                        >
                            {processing ? 'Processing...' : 'Pay Now'}
                        </button>
                        <button
                            disabled={processing}
                            onClick={() => simulate('failed')}
                            className="w-full rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        >
                            Simulate a failed payment
                        </button>
                        <button disabled={processing} onClick={cancel} className="mt-2 text-sm text-red-600 hover:underline">
                            Cancel order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
