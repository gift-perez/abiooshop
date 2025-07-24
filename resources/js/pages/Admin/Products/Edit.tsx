import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    collection: string;
    category: string;
    image: string;
}

interface Props {
    product: Product;
}

export default function Edit({product} : Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit a Product',
            href: `/products/${product.id}/edit`,
        },
    ];

    const {data, setData, post, processing, progress, errors} = useForm({
        _method: 'PUT', // Add method spoofing
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        collection: product.collection,
        category: product.category,
        image: product.image ? product.image : null as File | null,
    })

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        // Debug: Log the data being sent
        console.log('Form data being sent:', data);

        post(route('products.update', product.id), {
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
            onSuccess: (page) => {
                console.log('Success:', page);
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title="Edit a Product" />
            <div className='w-8/12 p-4 mx-auto my-4 rounded-lg border border-sidebar-border/70 dark:border-sidebar-border'>
                <form className='space-y-4' onSubmit={handleUpdate} encType="multipart/form-data">
                    {/* Display error */}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mb-4">
                            <div className="text-red-600">
                                <Alert>
                                    <MessageSquareWarning />
                                    <AlertTitle>Heads up!</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc pl-5">
                                            {Object.entries(errors).map(([key, value]) => (
                                                <li key={key}>{value}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </div>
                    )}
                    <div className='gap-1.5'>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            placeholder="Product Name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Product Description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.price}
                            onChange={e => setData('price', Number(e.target.value))}
                        />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            id="stock"
                            placeholder="0"
                            type="number"
                            min="0"
                            value={data.stock}
                            onChange={e => setData('stock', Number(e.target.value))}
                        />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="category">Collection</Label>
                    </div>
                    <div className='gap-1.5 mb-4'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{data.collection}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" side="bottom">
                                <DropdownMenuLabel>Collection</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={data.collection} onValueChange={value => setData('collection', value)}>
                            <DropdownMenuRadioItem value="ILIWYSFYASBYSUOI">ILIWYSFYASBYSUOI</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="ABIIOR">ABIIOR</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="NOACF">NOACF</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="BFIAFL">BFIAFL</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="category">Category</Label>
                    </div>
                    <div className='gap-1.5 mb-4'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{data.category}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" side="bottom">
                                <DropdownMenuLabel>Category</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={data.category} onValueChange={value => setData('category', value)}>
                                    <DropdownMenuRadioItem value="shirts">Tops</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="hoodies">Bottoms</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="accessories">Accessories</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="music">Music</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="image">Image</Label>
                        <br />
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const files = (e.target as HTMLInputElement).files;
                                setData('image', files && files[0] ? files[0] : null);
                            }}
                        />
                    </div>
                    <div>
                        <Button type='submit' disabled={processing}>
                            {processing ? 'Updating...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
