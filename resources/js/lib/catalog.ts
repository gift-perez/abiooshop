import type { OrderStatus } from '@/types';

/** Values stored in the database → labels shown to people. Keep in sync with ProductSeeder. */
export const COLLECTIONS: Record<string, string> = {
    the1975: 'The 1975',
    nbhd: 'The Neighbourhood',
    wknd: 'The Weeknd',
    focean: 'Frank Ocean',
};

export const CATEGORIES: Record<string, string> = {
    shirts: 'Shirts',
    hoodies: 'Hoodies',
    accessories: 'Accessories',
    music: 'Music',
};

export const ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: 'Awaiting payment', className: 'text-yellow-600' },
    processing: { label: 'Processing', className: 'text-blue-600' },
    paid: { label: 'Paid', className: 'text-green-600' },
    payment_failed: { label: 'Payment failed', className: 'text-red-600' },
    delivered: { label: 'Delivered', className: 'text-blue-600' },
    completed: { label: 'Completed', className: 'text-green-800' },
    cancelled_user: { label: 'Cancelled', className: 'text-red-600' },
    cancelled_admin: { label: 'Cancelled by store', className: 'text-red-600' },
};
