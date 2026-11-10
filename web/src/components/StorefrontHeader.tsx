"use client";

import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { roleHome } from "@/lib/roles";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function StorefrontHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/shops");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/shops" className="text-lg font-bold text-indigo-600">ShopHub</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/shops" className="text-gray-600 hover:text-gray-900">Shops</Link>

          <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "customer" && (
                <Link href="/account/orders" className="text-gray-600 hover:text-gray-900">My orders</Link>
              )}
              {user.role !== "customer" && (
                <Link href={roleHome(user.role)} className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              )}
              <span className="hidden text-gray-400 sm:inline">{user.name}</span>
              <button onClick={handleLogout} className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
