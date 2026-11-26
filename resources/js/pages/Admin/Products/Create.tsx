import ProductForm, { type ProductFormData } from '@/components/product-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/admin/products' },
    { title: 'Create', href: '/admin/products/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        name: '',
        description: '',
        price: '',
        stock: '',
        collection: 'the1975',
        category: 'shirts',
        image: null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('products.store'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a Product" />
            <div className="border-sidebar-border/70 dark:border-sidebar-border mx-auto my-4 w-full max-w-2xl rounded-lg border p-4">
                <ProductForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel="Add Product"
                />
            </div>
        </AppLayout>
    );
}
