"use client";

import { EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import type { Paginated, Shop } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api
        .get<Paginated<Shop>>("/storefront/shops", { search, per_page: 24 })
        .then((res) => setShops(res.data))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse shops</h1>
          <p className="text-sm text-gray-500">Discover products across every shop.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:w-64"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : shops.length === 0 ? (
        <EmptyState title="No shops found" hint="Try a different search." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              href={`/shops/${shop.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-900 group-hover:text-indigo-600">{shop.name}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {shop.products_count ?? 0} items
                </span>
              </div>
              {shop.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{shop.description}</p>}
              <p className="mt-4 text-sm font-medium text-indigo-600">Visit shop →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
