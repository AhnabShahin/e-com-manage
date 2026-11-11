"use client";

import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { roleHome } from "@/lib/roles";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ANNOUNCEMENTS = [
  "FREE DELIVERY ON ORDERS ABOVE TK 2,000",
  "NEW ELECTRONICS & FURNITURE DROPS WEEKLY",
  "MULTI-SHOP CATALOG — ONE CART, EVERY SHOP",
];

export function StorefrontHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/shops");
  };

  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="overflow-hidden border-b border-line bg-cream py-2">
        <div className="flex animate-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-maroon">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
            <span key={i} className="mx-8">
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/shops">
            <span className="block font-serif text-2xl font-bold tracking-[0.2em] text-brand-red">SHOPHUB</span>
            <span className="block text-[9px] font-semibold uppercase tracking-wide text-muted">by CSN Bangladesh Ltd.</span>
          </Link>
          <nav className="flex items-center gap-5 text-[13px] font-semibold uppercase tracking-wide">
            <Link href="/shops" className="text-nav hover:text-brand-red">
              Shops
            </Link>

            <Link href="/cart" className="relative text-nav hover:text-brand-red">
              Cart
              {count > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "customer" && (
                  <Link href="/account/orders" className="text-nav hover:text-brand-red">
                    My orders
                  </Link>
                )}
                {user.role !== "customer" && (
                  <Link href={roleHome(user.role)} className="text-nav hover:text-brand-red">
                    Dashboard
                  </Link>
                )}
                <span className="hidden normal-case tracking-normal text-muted sm:inline">{user.name}</span>
                <button onClick={handleLogout} className="border border-ink px-3 py-1.5 text-ink hover:bg-ink hover:text-white">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-ink px-4 py-2 text-white hover:bg-maroon">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
