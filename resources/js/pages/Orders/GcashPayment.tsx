import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface Order {
    id: string;
    total_cost: number;
    order_status: string;
}

export default function GcashPayment() {
    const { props } = usePage<{ orderId: string; order: Order }>();
    const orderId = props.orderId;
    const order = props.order;

    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(5);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const toastShown = useRef(false);

    // Listen to echo event
    useEffect(() => {
        if (!orderId) {
            console.error('No orderId passed to GcashPayment component');
            return;
        }

        window.Echo.private(`order.${orderId}`).listen('PaymentStatusUpdated', (e: any) => {
            console.log('Payment callback received:', e);

            const receivedStatus = e.status || e.data?.status;
            if (receivedStatus) {
                setStatus(receivedStatus);
            }

            setLoading(false);
        });

        return () => {
            window.Echo.leave(`order.${orderId}`);
        };
    }, [orderId]);

    // Countdown and auto redirect effect
    useEffect(() => {
        if (status === 'paid' && !intervalRef.current) {
            if (!toastShown.current) {
                toast.success('Your order has been confirmed successfully!');
                toastShown.current = true;
            }

            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        toast.success('Your order has been confirmed successfully!');
                        router.visit('/shop');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (status === 'payment_failed' && !intervalRef.current) {
            if (!toastShown.current) {
                toast.error('Your order has been termindated. Payment Unsuccessful. Please try again later.');
                toastShown.current = true;
            }

            intervalRef.current = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        router.visit('/shop');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [status]);

    const handlePay = async () => {
        setLoading(true);

        const res = await fetch('/api/payment/initiate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
            },
            body: JSON.stringify({ order_id: orderId }),
        });

        const data = await res.json();
        console.log('Full order details:', data.order);
    };

    const handleReturnNow = () => {
        toast.success('Your order has been confirmed successfully!');
        router.visit('/shop');
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0057e2]">
            <div className="w-full max-w-md rounded bg-white p-8 text-center shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-[#0057e2]">GCash</h1>

                <div className="mb-6 rounded bg-gray-100 p-4 text-left">
                    <div className="mb-2 flex justify-between">
                        <span className="text-gray-500">Merchant</span>
                        <span className="font-medium">ABIOO THE 1975</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount Due</span>
                        <span className="font-medium text-[#0057e2]">PHP {order.total_cost}</span>
                    </div>
                </div>

                {status === 'paid' ? (
                    <div className="flex flex-col items-center">
                        <svg className="mb-4 h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="mb-2 font-bold text-green-600">Payment Successful!</p>
                        <button onClick={handleReturnNow} className="mb-2 w-full rounded bg-[#0057e2] px-4 py-2 text-white hover:bg-[#0046b0]">
                            Return to Merchant
                        </button>
                        <p className="text-gray-600">
                            You will be redirected automatically in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
                        </p>
                    </div>
                ) : status === 'payment_failed' ? (
                    <div className="flex flex-col items-center">
                        <svg className="mb-4 h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="square"
                                strokeLinejoin="bevel"
                                strokeWidth={2}
                                d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L12 13.4l-6.3 6.3-1.4-1.4L10.6 12 4.3 5.7l1.4-1.4L12 10.6l6.3-6.3z"
                            />
                        </svg>
                        <p className="mb-2 font-bold text-red-600">Payment Failed!</p>
                        <button onClick={handleReturnNow} className="mb-2 w-full rounded bg-[#0057e2] px-4 py-2 text-white hover:bg-[#0046b0]">
                            Return to Merchant
                        </button>
                        <p className="text-gray-600">
                            You will be redirected automatically in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
                        </p>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center">
                        <svg className="mb-4 h-12 w-12 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <p className="font-medium text-gray-600">Processing payment...</p>
                    </div>
                ) : (
                    <button disabled={loading} onClick={handlePay} className="w-full rounded bg-[#0057e2] px-4 py-2 text-white hover:bg-[#0046b0]">
                        Pay Now
                    </button>
                )}
            </div>
        </div>
    );
}
