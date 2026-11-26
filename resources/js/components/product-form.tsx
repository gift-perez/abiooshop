import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES, COLLECTIONS } from '@/lib/catalog';
import { imageUrl } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { FormEvent } from 'react';

// A `type` (not `interface`) so it satisfies Inertia's useForm constraint.
export type ProductFormData = {
    name: string;
    description: string;
    price: string | number;
    stock: string | number;
    collection: string;
    category: string;
    image: File | null;
};

interface Props {
    data: ProductFormData;
    setData: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
    errors: Partial<Record<keyof ProductFormData, string>>;
    processing: boolean;
    onSubmit: (e: FormEvent) => void;
    submitLabel: string;
    currentImage?: string;
}

/** Shared by the Create and Edit product pages. */
export default function ProductForm({ data, setData, errors, processing, onSubmit, submitLabel, currentImage }: Props) {
    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-1.5">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Product Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Product Description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="price">Price (₱)</Label>
                <Input
                    id="price"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                />
                <InputError message={errors.price} />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input
                    id="stock"
                    placeholder="0"
                    type="number"
                    step="1"
                    min="0"
                    value={data.stock}
                    onChange={(e) => setData('stock', e.target.value)}
                />
                <InputError message={errors.stock} />
            </div>

            <Choice
                label="Collection"
                options={COLLECTIONS}
                value={data.collection}
                onChange={(v) => setData('collection', v)}
                error={errors.collection}
            />
            <Choice label="Category" options={CATEGORIES} value={data.category} onChange={(v) => setData('category', v)} error={errors.category} />

            <div className="grid gap-1.5">
                <Label htmlFor="image">Image</Label>
                {currentImage && !data.image && (
                    <img src={imageUrl(currentImage)} alt="Current product image" className="h-24 w-24 rounded object-cover" />
                )}
                <input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-gray-500">PNG, JPG, GIF or WebP, up to 2 MB.{currentImage ? ' Leave empty to keep the current image.' : ''}</p>
                <InputError message={errors.image} />
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </form>
    );
}

function Choice({
    label,
    options,
    value,
    onChange,
    error,
}: {
    label: string;
    options: Record<string, string>;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <div className="grid gap-1.5">
            <Label>{label}</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" type="button" className="w-fit">
                        {options[value] ?? value ?? `Choose ${label.toLowerCase()}`} <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom">
                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
                        {Object.entries(options).map(([key, text]) => (
                            <DropdownMenuRadioItem key={key} value={key}>
                                {text}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <InputError message={error} />
        </div>
    );
}
