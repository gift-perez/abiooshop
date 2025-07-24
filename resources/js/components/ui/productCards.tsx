import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, PackageSearch, ShoppingBag, X } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './button';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

export default function productCards ( { products }: Props) {

    return (
        <div>
            {products.length > 0 ? (
                <>
                    <div className='m-4'>
                        <div className="grid grid-cols-4  justify-items-center m-4">
                            {products.map((product) => (
                                <Link href={`/shop/${product.id}`} className="no-underline text-black" key={product.id}>
                                <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-90 h-125 m-4">
                                    <figure>
                                          <img src={`../${product.image}`} alt={product.name} className="w-full h-full object-cover rounded-lg shadow" />
                                    </figure>
                                    <div className="card-body items-center text-center m-4">
                                        <h2 className="card-title">{product.name}</h2>
                                        <p>{product.description}</p>
                                        <p className="text-green-600 font-bold">₱ {product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-64">
                    <PackageSearch className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No products found.</p>
                </div>
            )}
        </div>
    );
}
