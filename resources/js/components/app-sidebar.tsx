import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { PackageOpen, PackageSearch } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    // },
    {
        title: 'Products',
        href: '/products',
        icon: PackageSearch,
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: PackageOpen,
    },
];

const footerNavItems: NavItem[] = [];

const RangeSlider = () => {
    const [sliderValue, setSliderValueMin] = useState(20);
    const [sliderValueMax, setSliderValueMax] = useState(100);
    const handleSliderValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valueMin = parseInt(e.target.value);
        setSliderValueMin(valueMin);
    };

    const handleSliderValueMax = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valueMax = parseInt(e.target.value);
        setSliderValueMax(valueMax);
    };
    return <div className="flex flex-col items-center space-x-2"></div>;
};

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <RangeSlider />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
