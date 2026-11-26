import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCards from '@/components/ui/productCards';
import StoreLayout from '@/layouts/store-layout';
import { CATEGORIES, COLLECTION_TAGLINES, COLLECTIONS, FEATURED_COLLECTION } from '@/lib/catalog';
import { imageUrl, peso } from '@/lib/utils';
import type { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface CollectionSummary {
    collection: string;
    count: number;
    image: string | null;
}

interface Props {
    featured: Product[];
    products: Product[];
    collections: CollectionSummary[];
}

/** Hand-picked covers; other collections fall back to one of their product photos. */
const COLLECTION_COVERS: Record<string, string> = {
    nbhd: '/uploads/nbhd.png',
};

export default function Guest({ featured, products, collections }: Props) {
    return (
        <StoreLayout>
            <Head title="The 1975 fan merch" />
            <Hero />
            {featured.length > 0 && <Tracklist products={featured} />}
            {collections.length > 0 && <AlsoInStore collections={collections} />}

            <section className="mt-20">
                <SectionHeading eyebrow="Fresh off the press" title="New arrivals" href={route('shop.index')} />
                <ProductCards products={products} />
            </section>

            <MailingList />
        </StoreLayout>
    );
}

function Hero() {
    return (
        <section className="grain relative -mx-4 -mt-8 overflow-hidden bg-neutral-950 sm:mx-0 sm:mt-0 sm:rounded-xl">
            <img src="/uploads/t1975.png" alt="The 1975" className="aspect-[4/3] w-full object-cover grayscale sm:aspect-[21/9]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
                <p className="text-xs tracking-[0.3em] uppercase opacity-80">The headliner</p>
                <h1 className="mt-2 font-display text-5xl leading-none sm:text-7xl">The 1975 Collection</h1>
                <p className="mt-3 max-w-md font-display text-lg italic opacity-90 sm:text-xl">
                    Tees, hoodies, totes and vinyl, all in black and white.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="bg-white text-neutral-950 hover:bg-neutral-200">
                        <Link href={route('shop.index', { collection: FEATURED_COLLECTION })}>Shop The 1975</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
                        <Link href={route('shop.index')}>Browse everything</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

/** The featured band's products laid out like the back of a record sleeve. */
function Tracklist({ products }: { products: Product[] }) {
    return (
        <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
                <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Side A</p>
                <h2 className="mt-2 font-display text-4xl sm:text-5xl">{COLLECTIONS[FEATURED_COLLECTION]}</h2>
                <p className="mt-3 text-neutral-500">{COLLECTION_TAGLINES[FEATURED_COLLECTION]}</p>
                <Link
                    href={route('shop.index', { collection: FEATURED_COLLECTION })}
                    className="mt-6 inline-block border-b border-neutral-900 pb-0.5 text-sm font-medium"
                >
                    See the full collection
                </Link>
            </div>

            <ol className="divide-y border-y">
                {products.map((product, i) => (
                    <li key={product.id}>
                        <Link href={route('shop.show', product.id)} className="group flex items-center gap-4 py-4">
                            <span className="w-8 font-display text-2xl text-neutral-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                            <img
                                src={imageUrl(product.image)}
                                alt=""
                                loading="lazy"
                                className="h-14 w-14 rounded object-cover grayscale transition group-hover:grayscale-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium group-hover:underline">{product.name}</p>
                                <p className="text-sm text-neutral-500">{CATEGORIES[product.category] ?? product.category}</p>
                            </div>
                            <span className="font-medium tabular-nums">{peso(product.price)}</span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function AlsoInStore({ collections }: { collections: CollectionSummary[] }) {
    return (
        <section className="mt-20">
            <SectionHeading eyebrow="Side B" title="Also in the store" />
            <div className="grid gap-4 sm:grid-cols-3">
                {collections.map(({ collection, count, image }) => (
                    <Link
                        key={collection}
                        href={route('shop.index', { collection })}
                        className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-neutral-900"
                    >
                        <img
                            src={COLLECTION_COVERS[collection] ?? imageUrl(image)}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover opacity-80 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                            <h3 className="font-display text-3xl">{COLLECTIONS[collection] ?? collection}</h3>
                            <p className="mt-1 text-sm opacity-80">{COLLECTION_TAGLINES[collection]}</p>
                            <p className="mt-3 text-xs tracking-widest uppercase opacity-70">{count} pieces →</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function MailingList() {
    const [email, setEmail] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setEmail('');
        toast.success("You're on the list (demo only, nothing was sent).");
    };

    return (
        <section className="grain relative mt-20 overflow-hidden rounded-xl bg-neutral-950 px-6 py-12 text-center text-white sm:px-12">
            <p className="text-xs tracking-[0.3em] uppercase opacity-70">Mailing list</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Be the first to know about drops</h2>
            <p className="mx-auto mt-3 max-w-md text-sm opacity-70">New pieces, restocks and the occasional limited run. No spam.</p>
            <form onSubmit={submit} className="relative z-10 mx-auto mt-6 flex max-w-md gap-2">
                <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                />
                <Button type="submit" className="bg-white text-neutral-950 hover:bg-neutral-200">
                    Sign up
                </Button>
            </form>
        </section>
    );
}

function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
    return (
        <div className="mb-6 flex items-end justify-between">
            <div>
                <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">{eyebrow}</p>
                <h2 className="mt-1 font-display text-4xl">{title}</h2>
            </div>
            {href && (
                <Link href={href} className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
                    View all →
                </Link>
            )}
        </div>
    );
}
