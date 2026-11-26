import ProductForm, { type ProductFormData } from '@/components/product-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Product } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    product: Product;
}

export default function Edit({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/admin/products' },
        { title: 'Edit', href: `/admin/products/${product.id}/edit` },
    ];

    const { data, setData, post, processing, errors, transform } = useForm<ProductFormData>({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        collection: product.collection,
        category: product.category,
        image: null, // only sent when a new file is picked
    });

    // File uploads need a real POST; Laravel reads _method to treat it as PUT.
    transform((d) => ({ ...d, _method: 'put' }));

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        post(route('products.update', product.id), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name}`} />
            <div className="border-sidebar-border/70 dark:border-sidebar-border mx-auto my-4 w-full max-w-2xl rounded-lg border p-4">
                <ProductForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleUpdate}
                    submitLabel="Update Product"
                    currentImage={product.image}
                />
            </div>
        </AppLayout>
    );
}
