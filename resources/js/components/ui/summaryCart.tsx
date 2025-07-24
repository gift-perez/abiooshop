import { usePage, Link } from "@inertiajs/react";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "./button";
import type { Cart } from '@/types';



interface Props{
    cart: Cart;
}
export default function Summary({ cart }: Props){

    return(
        <div>
            <div className="text-3xl font-bold text-gray-800">
                Summary
            </div>
             {cart ? (
            <><div className="divider"></div><div className="text-sm text-gray-500">
                    <div className="flex justify-between">
                        Subtotal
                        <p>
                            ₱  {cart.subtotal.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        Shipping fee
                        <p>
                            ₱ 100.00
                        </p>
                    </div>
                </div><div className="divider"></div><div className="text-sm text-gray-500">
                        <div className="flex justify-between">
                            Total
                            <p className="text-l font-bold text-gray-800">
                                ₱ {cart.total_cost}
                            </p>
                        </div>
                    </div><div className="divider"></div><div className="flex justify-center">

                        <div className="w-full">
                            <Link href={route('checkout')}>
                                <Button className="w-full">
                                    Proceed to checkout
                                </Button>
                            </Link>
                        </div>
                    </div></>

           ) : (
                <p>Your cart is empty.</p>
            )}
        </div>

    )
}
