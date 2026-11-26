import ProductCards from '@/components/ui/productCards';
import StoreLayout from '@/layouts/store-layout';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    products: Product[];
}

/** Hero banners. Each links to its collection in the shop. */
const SLIDES = [
    { src: '/uploads/t1975.png', alt: 'The 1975 collection', collection: 'the1975' },
    { src: '/uploads/nbhd.png', alt: 'The Neighbourhood collection', collection: 'nbhd' },
];

export default function Guest({ products }: Props) {
    return (
        <StoreLayout>
            <Head title="Welcome" />
            <HeroCarousel />

            <section className="mt-12">
                <div className="mb-6 flex items-end justify-between">
                    <h2 className="text-2xl font-bold">New arrivals</h2>
                    <Link href={route('shop.index')} className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
                        View all →
                    </Link>
                </div>
                <ProductCards products={products} />
            </section>
        </StoreLayout>
    );
}

function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const go = (step: number) => setIndex((i) => (i + step + SLIDES.length) % SLIDES.length);

    // Auto-advance; restarts whenever the slide changes, so a click resets the timer.
    useEffect(() => {
        const id = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
        return () => clearTimeout(id);
    }, [index]);

    return (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 sm:aspect-[21/9]">
            {SLIDES.map((slide, i) => (
                <Link
                    key={slide.src}
                    href={route('shop.index', { collection: slide.collection })}
                    className={cn('absolute inset-0 transition-opacity duration-700', i === index ? 'opacity-100' : 'pointer-events-none opacity-0')}
                    aria-hidden={i !== index}
                    tabIndex={i === index ? 0 : -1}
                >
                    <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
                </Link>
            ))}

            <CarouselButton side="left" onClick={() => go(-1)} />
            <CarouselButton side="right" onClick={() => go(1)} />

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.src}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show slide ${i + 1}`}
                        className={cn('h-2 rounded-full transition-all', i === index ? 'w-6 bg-white' : 'w-2 bg-white/60')}
                    />
                ))}
            </div>
        </div>
    );
}

function CarouselButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
    const Icon = side === 'left' ? ChevronLeft : ChevronRight;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={side === 'left' ? 'Previous slide' : 'Next slide'}
            className={cn(
                'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-900 shadow transition hover:bg-white',
                side === 'left' ? 'left-3' : 'right-3',
            )}
        >
            <Icon className="h-5 w-5" />
        </button>
    );
}
