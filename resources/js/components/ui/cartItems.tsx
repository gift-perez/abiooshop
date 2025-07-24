import { router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { ChevronDown, ShoppingBag, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from './button';
import type { Cart, CartItem } from '@/types';

interface Props {
  cart: Cart;
  cartItems: CartItem[];
}

export default function CartItems({ cart, cartItems }: Props) {
  const { flash } = usePage().props as { flash?: { message?: string } };
  const { auth } = usePage<SharedData>().props;
  // Local state for immediate UI (optional)
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(cartItems.map(item => [item.product_id, item.quantity]))
  );

  const handleDelete = (productId: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the cart?`)) {
      router.post(`/cart/remove/${productId}`, { productId }, {
        onSuccess: () => {
          toast.success(`Removed "${name}" from cart`);
        },
        onError: () => {
          toast.error('Failed to remove product from cart');
        }
      });
    }
  };

    function handleQuantityChange(productId: string | undefined, value: string): void {
    if (!productId) {
        toast.error("Invalid product ID");
        return;
    }
    const quantity = parseInt(value, 10);

    setQuantities(prev => ({
        ...prev,
        [productId]: quantity,
    }));

    router.put(`/cart/update/${productId}`, { productId, quantity }, {
        preserveScroll: true,
        only: ['cart', 'cartItems'],
        onSuccess: () => {
        toast.success('Quantity updated');
        },
        onError: () => {
        toast.error('Failed to update quantity');
        }
    });
    }



    function handleClear(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.preventDefault();
    if (confirm('Are you sure you want to clear the cart?')) {
        router.put('/cart/clear', {}, {
        onSuccess: () => {
            toast.success('Cart cleared successfully!');
        },
        onError: () => {
            toast.error('Failed to clear cart');
        }
        });
    }
}

  return (
    <div>
      {cartItems.length > 0 ? (
        <>
          <div className="text-3xl font-bold text-gray-800">
            Cart
            <div className="flex justify-between items-center">
              <span></span>
              <Button onClick={handleClear} className="m-4" variant="ghost">
                Clear cart
              </Button>
            </div>
          </div>
          <div className="m-4">
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
                {cartItems.map((cartItem, idx) => (
                  <TableRow
                    key={cartItem.product_id ?? `item-${idx}`}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-row m-4">
                        <div className="card bg-base-100 w-24 shadow-sm">
                          <figure>
                            <img
                              src={cartItem.image}
                              alt={cartItem.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </figure>
                        </div>
                        <div className="m-4 text-left">
                          <p className="font-semibold">{cartItem.name}</p>
                          <p className="text-sm text-gray-600">{cartItem.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                    {auth.user ? (
  <div className="flex items-center justify-center space-x-2">
                        <div className="tooltip tooltip-bottom" data-tip="Remove item">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cartItem.product_id, cartItem.name)}
                            className="ml-2 m-2"
                            aria-label={`Remove ${cartItem.name} from cart`}
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              {cartItem.quantity}
                              <ChevronDown />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 mx-4" side="bottom">
                            <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              value={cartItem.quantity.toString()}
                              onValueChange={(value) => handleQuantityChange(cartItem.product_id, value)}
                            >
                              {Array.from({ length: cartItem.stock }, (_, i) => i + 1).map((i) => (
                                <DropdownMenuRadioItem key={i} value={i.toString()}>
                                  {i}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ):(
                        <div>
                            { cartItem.quantity }
                        </div>
                    )}
                    </TableCell>
                    <TableCell>₱ {cartItem.price.toFixed(2)}</TableCell>
                    <TableCell>₱ {cartItem.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Your Bag is Empty</p>
        </div>
      )}
    </div>
  );
}
