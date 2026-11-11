"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const dashHref = user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="overflow-hidden border-b border-line bg-cream py-2">
        <div className="flex animate-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-maroon">
          {Array.from({ length: 2 }).flatMap((_, rep) =>
            [
              "FREE DELIVERY ON ORDERS ABOVE TK 2,000",
              "NEW ELECTRONICS & FURNITURE DROPS WEEKLY",
              "MULTI-SHOP CATALOG — ONE CART, EVERY SHOP",
            ].map((a, i) => (
              <span key={`${rep}-${i}`} className="mx-8">
                {a}
              </span>
            )),
          )}
        </div>
      </div>

      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <span>
          <span className="block font-serif text-2xl font-bold tracking-[0.2em] text-brand-red">SHOPHUB</span>
          <span className="block text-[9px] font-semibold uppercase tracking-wide text-muted">by CSN Bangladesh Ltd.</span>
        </span>
        <div className="flex gap-3 text-[13px] font-semibold uppercase tracking-wide">
          <Link href="/shops" className="px-4 py-2 text-ink hover:text-brand-red">
            Browse Shops
          </Link>
          <Link href={dashHref} className="bg-ink px-4 py-2 text-white hover:bg-maroon">
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          One catalog. <span className="text-brand-red">Many shops.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          A shared product catalog that admins and shop owners build together. Owners list catalog
          products in their own shops with their own prices, details, and thumbnails — customers see
          only what&apos;s on the shelves.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-[13px] font-semibold uppercase tracking-wide">
          <Link href="/shops" className="bg-ink px-6 py-3 text-white hover:bg-maroon">
            Shop now
          </Link>
          <Link href="/login" className="border border-ink bg-white px-6 py-3 text-ink hover:bg-ink hover:text-white">
            Manage a shop
          </Link>
        </div>

        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          {[
            { t: "Admin", d: "Manage shops, products, and shop-owner accounts." },
            { t: "Shop owner", d: "Pick from the shared catalog or add your own products." },
            { t: "Customer", d: "Browse shops and buy listed products at shop prices." },
          ].map((f) => (
            <div key={f.t} className="border border-line bg-white p-4">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-brand-red">{f.t}</p>
              <p className="mt-1 text-sm text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-line px-6 py-6 text-center text-xs text-muted">
        Demo accounts — admin@example.com / alice@example.com / bob@example.com (password: <code>password</code>)
      </footer>
    </div>
  );
}
