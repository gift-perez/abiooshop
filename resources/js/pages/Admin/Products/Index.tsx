import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
// import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, PackageSearch } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    collection: number;
    category: string;
    image: string;
}

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}
interface Pageprops {
      items: {
    data: Item[];
    current_page: number;
    last_page: number;
    links: PaginationLinks[];
  };
    flash: {
        message?: string;
    };
    products: Product[];
}
interface Products {
    products: Product[];
}
export default function Index({ products }) {
    const { flash } = usePage().props as Pageprops;
    const { processing, delete: inertiaDelete } = useForm();


    const handleDelete = (id: number, name: string) => {
        //alert("Do you want to delete the " + name + " product?");

        if (confirm(`Are you sure you want to delete the product "${name}" with id - "${id}"?`)) {
            // Perform the delete action
            inertiaDelete(`/products/${id}/delete`);
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
            <div className="m-4">
                {flash.message && (
                    <Alert>
                        <Megaphone />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>
            {products.length > 0 ? (
                <>
                    <div className="m-4">
                        <Table>
                            <TableCaption>A list of the products in the database.</TableCaption>
                            <TableHeader>
                                <TableRow className="space-x-2 text-center">
                                    <TableHead className="w-[100px]">Product ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Collection</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} className="text-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>₱{product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{product.collection}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="h-16 w-16 rounded object-cover" />
                                            ) : (
                                                <PlaceholderPattern className="h-16 w-16" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={route('products.edit', product.id)} className="text-blue-600 hover:underline">
                                                <Button type="submit" className="mr-2 bg-slate-500 hover:bg-slate-700">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="bg-red-500 hover:bg-red-700"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div class="container">

                    </div>

                    { products->links() }
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
