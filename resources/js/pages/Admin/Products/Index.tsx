import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { CATEGORIES, COLLECTIONS } from '@/lib/catalog';
import { imageUrl, peso } from '@/lib/utils';
import type { BreadcrumbItem, Paginated, Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PackageSearch } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: '/admin/products' }];

interface Props {
    products: Paginated<Product>;
}

export default function Index({ products }: Props) {
    const handleDelete = (product: Product) => {
        if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            router.delete(route('products.destroy', product.id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="m-4">
                <Link href={route('products.create')}>
                    <Button>Create a Product</Button>
                </Link>
            </div>

            {products.data.length > 0 ? (
                <>
                    <div className="m-4">
                        <Table>
                            <TableCaption>All products in the store.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Collection</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product) => (
                                    <TableRow key={product.id} className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <TableCell>
                                            <img src={imageUrl(product.image)} alt={product.name} className="h-16 w-16 rounded object-cover" />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                                        <TableCell>{peso(product.price)}</TableCell>
                                        <TableCell className={product.stock < 1 ? 'text-red-600' : ''}>{product.stock}</TableCell>
                                        <TableCell>{COLLECTIONS[product.collection] ?? product.collection}</TableCell>
                                        <TableCell>{CATEGORIES[product.category] ?? product.category}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <Link href={route('products.edit', product.id)}>
                                                <Button className="mr-2 bg-slate-500 hover:bg-slate-700">Edit</Button>
                                            </Link>
                                            <Button onClick={() => handleDelete(product)} className="bg-red-500 hover:bg-red-700">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {products.last_page > 1 && (
                        <nav className="m-4 flex flex-wrap gap-2" aria-label="Pagination">
                            {products.links.map(({ url, label, active }, index) => {
                                const pageLabel = label.includes('Previous') ? 'Previous' : label.includes('Next') ? 'Next' : label;
                                const className = `rounded border px-3 py-1 ${
                                    active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'
                                } ${url ? '' : 'pointer-events-none opacity-50'}`;

                                return url ? (
                                    <Link key={`${label}-${index}`} href={url} preserveScroll className={className}>
                                        {pageLabel}
                                    </Link>
                                ) : (
                                    <span key={`${label}-${index}`} className={className}>
                                        {pageLabel}
                                    </span>
                                );
                            })}
                        </nav>
                    )}
                </>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center">
                    <PackageSearch className="mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">No products found.</p>
                </div>
            )}
        </AppLayout>
    );
}
