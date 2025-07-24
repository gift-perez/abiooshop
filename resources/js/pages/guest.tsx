import { Navbar } from '@/components/ui/navbar';
import ProductCards from '@/components/ui/productCards';
import type { Cart, Product } from '@/types';
import { type SharedData } from '@/types';

import { Head, usePage } from '@inertiajs/react';
interface Props {
    products: Product[];
    flash: {
        message?: string;
    };
    cart: Cart;
}
export default function Guest({ products, flash, cart }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Navbar cart={cart} />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    {/* <nav className="flex items-center justify-end gap-4"> */}

                    {/* </nav> */}
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="carousel h-100 w-full">
                            <div id="slide1" className="relative carousel-item h-full w-full">
                                <img src="../uploads/t1975.png" className="h-full w-full" />
                                <div className="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between">
                                    <a href="#slide4" className="btn btn-circle">
                                        ❮
                                    </a>
                                    <a href="#slide2" className="btn btn-circle">
                                        ❯
                                    </a>
                                </div>
                            </div>
                            <div id="slide2" className="relative carousel-item w-full">
                                <img src="../uploads/nbhd.png" className="h-full w-full" />
                                <div className="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between">
                                    <a href="#slide1" className="btn btn-circle">
                                        ❮
                                    </a>
                                    <a href="#slide3" className="btn btn-circle">
                                        ❯
                                    </a>
                                </div>
                            </div>
                            <div id="slide3" className="relative carousel-item w-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp" className="w-full" />
                                <div className="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between">
                                    <a href="#slide2" className="btn btn-circle">
                                        ❮
                                    </a>
                                    <a href="#slide4" className="btn btn-circle">
                                        ❯
                                    </a>
                                </div>
                            </div>
                            <div id="slide4" className="relative carousel-item w-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp" className="w-full" />
                                <div className="absolute top-1/2 right-5 left-5 flex -translate-y-1/2 transform justify-between">
                                    <a href="#slide3" className="btn btn-circle">
                                        ❮
                                    </a>
                                    <a href="#slide1" className="btn btn-circle">
                                        ❯
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <ProductCards products={products} />
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
