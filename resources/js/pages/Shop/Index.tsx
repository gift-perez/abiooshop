import { Navbar } from '@/components/ui/navbar';
import ProductCards from '@/components/ui/productCards';
import type { Product } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    products: Product[];
}

export default function Index({ products }: Props) {
    return (
        <>
            <Head title="Shop" />
            <Navbar />
            <ProductCards products={products} />
        </>
    );
}
