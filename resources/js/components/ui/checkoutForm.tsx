import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { MessageSquareWarning } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

interface Props {
    mode: 'cart' | 'buy_now';
}

export default function CheckoutForm({ mode }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        receiver_name: '',
        receiver_address: '',
        phone: '',
        mode,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('orders.finalize'));
    };

    const stockError = (errors as Record<string, string>).stock;

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {stockError && (
                <Alert variant="destructive">
                    <MessageSquareWarning />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>{stockError}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4 rounded border p-4">
                <h2 className="font-semibold">Delivery Information</h2>
                <div className="grid gap-1.5">
                    <Label htmlFor="receiver_name">Receiver Name</Label>
                    <Input
                        id="receiver_name"
                        autoComplete="name"
                        placeholder="Juan Dela Cruz"
                        value={data.receiver_name}
                        onChange={(e) => setData('receiver_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.receiver_name} />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="receiver_address">Receiver Address</Label>
                    <Textarea
                        id="receiver_address"
                        autoComplete="street-address"
                        placeholder="House no., street, barangay, city, province"
                        value={data.receiver_address}
                        onChange={(e) => setData('receiver_address', e.target.value)}
                        required
                    />
                    <InputError message={errors.receiver_address} />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="phone">Receiver Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="09XXXXXXXXX"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} />
                </div>
            </div>

            <div className="space-y-2 rounded border p-4">
                <h2 className="font-semibold">Payment</h2>
                <div className="flex items-center gap-3">
                    <img src="/uploads/GCash-Logo.png" alt="GCash" className="h-10 w-auto object-contain" />
                    <span className="text-sm text-gray-600">GCash (demo — no real money is charged)</span>
                </div>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Placing order...' : 'Place order & pay'}
            </Button>
        </form>
    );
}
