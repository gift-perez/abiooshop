import { Link, router, usePage } from "@inertiajs/react";
import { PackageOpen, ShoppingBag, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserInfo } from "../user-info";
import { UserMenuContent } from "../user-menu-content";
import type { SharedData } from "@/types";

export function Navbar() {
     const { numItems, auth } = usePage<SharedData>().props;

    const handleCategorySelect = (category: string) => {
    router.post(route('shop.filter.category'), { category });
    };

    const handleCollectionSelect = (collection: string) => {
    router.post(route('shop.filter.collection'), { collection });
    };
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">


        <div>
          <Link href="/shop" className="font-bold text-lg hover:text-blue-500">
            ABIIO SHOP
          </Link>
        </div>

{/*
            <div className="flex items-center space-x-6">
           Collections
                    <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="cursor-pointer">Collections</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow w-52 mt-2">
              <li><a onClick={() => handleCollectionSelect('ILIWYSFYASBYSUOI')}>ILIWYSFYASBYSUOI</a></li>
              <li><a onClick={() => handleCollectionSelect('ABIIOR')}>ABIIOR</a></li>
              <li><a onClick={() => handleCollectionSelect('NOACF')}>NOACF</a></li>
              <li><a onClick={() => handleCollectionSelect('BFIAFL')}>BFIAFL</a></li>
            </ul>
          </div>

          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="cursor-pointer">Categories</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow w-52 mt-2">
              <li><a onClick={() => handleCategorySelect('Shirts')}>Shirts</a></li>
              <li><a onClick={() => handleCategorySelect('Hoodies')}>Hoodies</a></li>
              <li><a onClick={() => handleCategorySelect('Accessories')}>Accessories</a></li>
              <li><a onClick={() => handleCategorySelect('Music')}>Music</a></li>
            </ul>
          </div>
        </div> */}


        <div className="flex items-center space-x-4">
          <Link href={route('cart')} className="relative">
            <ShoppingBag />
            {numItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {numItems > 9 ? "9+" : numItems}
              </span>
            )}
          </Link>

          <Link href={route('orders.showOrders')}>
            <PackageOpen />
          </Link>

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
              <Link
                href={route('login')}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href={route('register')}
                className="px-4 py-1.5 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100"
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
