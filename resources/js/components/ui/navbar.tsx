import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LayoutDashboard, PackageOpen, ShoppingBag } from 'lucide-react';
import { UserInfo } from '../user-info';
import { UserMenuContent } from '../user-menu-content';

export function Navbar() {
    const { numItems, auth } = usePage<SharedData>().props;

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href={route('shop.index')} className="text-lg font-bold hover:text-blue-500">
                    ABIIO SHOP
                </Link>

                <div className="flex items-center space-x-4">
                    {auth.user?.role === 'admin' && (
                        <Link href={route('products.index')} title="Admin" aria-label="Admin dashboard">
                            <LayoutDashboard />
                        </Link>
                    )}

                    <Link href={route('cart')} className="relative" aria-label="Cart">
                        <ShoppingBag />
                        {numItems > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                {numItems > 9 ? '9+' : numItems}
                            </span>
                        )}
                    </Link>

                    {auth.user && (
                        <Link href={route('orders.showOrders')} aria-label="My orders">
                            <PackageOpen />
                        </Link>
                    )}

                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="flex items-center">
                                    <UserInfo user={auth.user} />
                                    <ChevronsUpDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-56">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href={route('login')} className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900">
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-100"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
