import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PackageOpen, PackageSearch, Store, Truck, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    { title: 'Products', href: '/admin/products', icon: PackageSearch },
    { title: 'Orders', href: '/admin/orders', icon: PackageOpen },
];

const customerNavItems: NavItem[] = [{ title: 'Order tracking', href: '/my-orders', icon: Truck }];

const footerNavItems: NavItem[] = [{ title: 'View store', href: '/shop', icon: Store }];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const url = usePage().url;
    const isAdmin = auth.user?.role === 'admin';

    // Covers Profile, Password and Appearance, which all live under /settings.
    const settingsItem: NavItem = { title: 'Profile settings', href: '/settings/profile', icon: UserCog, isActive: url.startsWith('/settings') };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? '/admin/products' : '/shop'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isAdmin ? (
                    <>
                        <NavMain label="Store admin" items={adminNavItems} />
                        <NavMain label="Account" items={[settingsItem]} />
                    </>
                ) : (
                    <NavMain label="My account" items={[...customerNavItems, settingsItem]} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
