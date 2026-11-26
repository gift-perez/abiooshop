import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** "₱ 1,234.00". Accepts numbers or numeric strings from the API. */
export function peso(value: number | string | null | undefined): string {
    const n = Number(value ?? 0);
    return `₱ ${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Product images are stored as "uploads/x.png"; make them absolute so they work on any URL depth. */
export function imageUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (/^https?:\/\//.test(path) || path.startsWith('/')) return path;
    return `/${path}`;
}
