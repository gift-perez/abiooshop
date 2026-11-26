import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { imageUrl, peso } from '@/lib/utils';
import type { CartItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ChevronDown, ShoppingBag, X } from 'lucide-react';
import { Button } from './button';

interface Props {
    cartItems: CartItem[];
}

export default function CartItems({ cartItems }: Props) {
    const handleDelete = (productId: string, name: string) => {
        if (confirm(`Remove "${name}" from your cart?`)) {
            router.post(route('cart.remove', productId), {}, { preserveScroll: true });
        }
    };

    const handleQuantityChange = (productId: string, value: string) => {
        router.put(route('cart.update', productId), { quantity: parseInt(value, 10) }, { preserveScroll: true });
    };

    const handleClear = () => {
        if (confirm('Clear your cart?')) {
            router.put(route('cart.clear'));
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center">
                <ShoppingBag className="mb-4 h-12 w-12 text-gray-400" />
                <p className="font-display text-2xl">A brief inquiry into an empty bag</p>
                <p className="mt-1 mb-4 text-sm text-gray-500">Nothing in here yet. The 1975 collection is a good place to start.</p>
                <Link href={route('shop.index')}>
                    <Button variant="outline">Continue shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="font-display text-4xl">Your bag</h1>
                <Button onClick={handleClear} variant="ghost">
                    Clear cart
                </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Item</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((cartItem) => (
                            <TableRow key={cartItem.product_id} className="text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                <TableCell className="font-medium">
                                    <Link href={route('shop.show', cartItem.product_id)} className="flex flex-row items-center gap-4 py-2">
                                        <img
                                            src={imageUrl(cartItem.image)}
                                            alt={cartItem.name}
                                            className="h-20 w-20 shrink-0 rounded border bg-white object-cover sm:h-24 sm:w-24"
                                        />
                                        <div className="min-w-0 text-left">
                                            <p className="font-semibold">{cartItem.name}</p>
                                            <p className="line-clamp-2 text-sm whitespace-normal text-gray-600">{cartItem.description}</p>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(cartItem.product_id, cartItem.name)}
                                            className="m-2 ml-2"
                                            aria-label={`Remove ${cartItem.name} from cart`}
                                        >
                                            <X className="h-4 w-4 text-red-500" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">
                                                    {cartItem.quantity}
                                                    <ChevronDown />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="mx-4 max-h-72 w-56 overflow-y-auto" side="bottom">
                                                <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuRadioGroup
                                                    value={String(cartItem.quantity)}
                                                    onValueChange={(value) => handleQuantityChange(cartItem.product_id, value)}
                                                >
                                                    {Array.from({ length: Math.max(cartItem.stock, cartItem.quantity) }, (_, i) => (
                                                        <DropdownMenuRadioItem key={i + 1} value={String(i + 1)}>
                                                            {i + 1}
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    {cartItem.quantity > cartItem.stock && (
                                        <p className="mt-1 text-xs text-red-600">Only {cartItem.stock} left in stock</p>
                                    )}
                                </TableCell>
                                <TableCell>{peso(cartItem.price)}</TableCell>
                                <TableCell>{peso(cartItem.subtotal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
