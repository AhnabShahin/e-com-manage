"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const dashHref = user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-indigo-600">ShopHub</span>
        <div className="flex gap-3">
          <Link href="/shops" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Browse Shops
          </Link>
          <Link href={dashHref} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          One catalog. <span className="text-indigo-600">Many shops.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-gray-600">
          A shared product catalog that admins and shop owners build together. Owners list catalog
          products in their own shops with their own prices, details, and thumbnails — customers see
          only what&apos;s on the shelves.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shops" className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500">
            Shop now
          </Link>
          <Link href="/login" className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-800 hover:bg-gray-50">
            Manage a shop
          </Link>
        </div>

        <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
          {[
            { t: "Admin", d: "Manage shops, products, and shop-owner accounts." },
            { t: "Shop owner", d: "Pick from the shared catalog or add your own products." },
            { t: "Customer", d: "Browse shops and buy listed products at shop prices." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-900">{f.t}</p>
              <p className="mt-1 text-sm text-gray-600">{f.d}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-gray-400">
        Demo accounts — admin@example.com / alice@example.com / bob@example.com (password: <code>password</code>)
      </footer>
    </div>
  );
}
