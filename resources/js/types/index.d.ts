import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    // Null for guests at runtime; typed as User (starter-kit convention) because
    // the layouts that read it are only rendered for logged-in users.
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Flash {
    success?: string | null;
    error?: string | null;
    message?: string | null;
}

export interface SharedData {
    name: string;
    auth: Auth;
    numItems: number;
    flash: Flash;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface CartItem {
    product_id: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
    image: string;
    subtotal: number;
    stock: number;
}

export interface Cart {
    status: string;
    subtotal: number;
    shipping_cost: number;
    total_cost: number;
    num_items: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    collection: string;
    category: string;
    image: string;
}

export interface OrderLine {
    product_id: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    subtotal: number;
    image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'payment_failed' | 'delivered' | 'completed' | 'cancelled_user' | 'cancelled_admin';

export interface Order {
    id: string;
    user_id?: string;
    name: string;
    address: string;
    phone: string;
    order_status: OrderStatus;
    cancellation_reason?: string | null;
    /** Human-readable reason when the store cancelled the order. */
    cancellation_reason_label?: string | null;
    subtotal: number;
    shipping_cost: number;
    total_cost: number;
    cart: OrderLine[];
    created_at?: string;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}
