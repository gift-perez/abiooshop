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


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a Product',
        href: '/products/create',
    },
];

export default function Index() {

    const {data, setData, post, processing, progress, errors} = useForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        collection: "ILIWYSFYASBYSUOI",
        category: "tops",
        image: null as File | null,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    collection: "ILIWYSFYASBYSUOI",
                    category: "tops",
                    image: null,
                });
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a Product" />
            <div className='w-8/12 p-4 mx-auto my-4 rounded-lg border border-sidebar-border/70 dark:border-sidebar-border'>
                <form className='space-y-4' onSubmit={handleSubmit} encType="multipart/form-data">
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
                        <Input placeholder = "Product Name" value={data.name} onChange={e => setData('name', e.target.value)}/>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="description">Description</Label>
                        <Textarea placeholder = "Product Description"value={data.description} onChange={e => setData('description', e.target.value)}/>
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="price">Price</Label>
                        <Input placeholder = "0.00" type="decimal" value={data.price} onChange={e => setData('price', e.target.value)} />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="price">Stock</Label>
                        <Input placeholder = "0" type="integer" value={data.stock} onChange={e => setData('stock', e.target.value)} />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor="collection">Collection</Label>
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
                        <Label htmlFor="collection">Collection</Label>
                    </div>
                    <div className='gap-1.5 mb-4'>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{data.category}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" side="bottom">
                            <DropdownMenuLabel>Collection</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={data.category} onValueChange={value => setData('category', value)}>
                            <DropdownMenuRadioItem value="shirts">Shirts</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="hoodies">Hoodies</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="accessories">Accessories</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="music">Music</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className='gap-1.5' >
                        <Label htmlFor="image">Image</Label>
                        <br></br>
                        <input
                            type="file"
                            onChange={e => {
                                const files = (e.target as HTMLInputElement).files;
                                setData('image', files && files[0] ? files[0] : null);
                            }}
                        />
                    </div>
                    <div>
                        <Button  type='submit'>Add Product</Button>
                    </div>
                </form>
            </div>
        </AppLayout>

    );
}
