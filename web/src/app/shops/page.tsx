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
          <h1 className="text-2xl font-bold text-ink">Browse shops</h1>
          <p className="text-sm text-muted">Discover products across every shop.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops…"
          className="w-full border border-line px-3 py-2 text-sm sm:w-64"
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
              className="group border border-line bg-white p-5 transition hover:border-brand-red/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-ink group-hover:text-brand-red">{shop.name}</h2>
                <span className="rounded-full bg-cream px-2 py-0.5 text-xs text-muted">
                  {shop.products_count ?? 0} items
                </span>
              </div>
              {shop.description && <p className="mt-2 line-clamp-2 text-sm text-muted">{shop.description}</p>}
              <p className="mt-4 text-sm font-medium text-brand-red">Visit shop →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
