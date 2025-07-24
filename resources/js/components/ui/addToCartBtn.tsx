import React, { useState } from 'react';
import { Button } from './button';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';
import { router } from '@inertiajs/react';

interface AddToCartButtonProps {
    productId: number; // or string, depending on your data
    quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, quantity }) => {

    const [cartQuantity, setCartQuantity] = useState(quantity);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = () => {
        setLoading(true);

        interface AddToCartData {
            product_id: number;
            quantity: number;
        }

        interface AddToCartErrors {
            product_id?: string;
            [key: string]: string | undefined;
        }

        router.post(
            '/cart/add',
            { product_id: productId, quantity: cartQuantity },
            {
                onFinish: (): void => setLoading(false),
                onSuccess: (): void => {
                    toast(
                        <span><ShoppingBag/>Product added to cart</span>
                    );
                },
                onError: (errors: AddToCartErrors): void => alert(errors.product_id || 'Something went wrong!'),
            }
        );
    };

    return (
        <><div>
            quantity: {cartQuantity}
        </div><Button variant={"ghost"} onClick={handleAddToCart} disabled={loading} className="btn btn-primary">
                {loading ? <span className="loading loading-ring loading-lg" style={{ color: '#2563eb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></span> : 'Add to Cart'}
            </Button></>
    );
};

export default AddToCartButton;
