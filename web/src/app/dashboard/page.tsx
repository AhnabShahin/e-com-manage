"use client";

import { Badge, EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import type { Shop } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: Shop[] }>("/my/shops").then((r) => setShops(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">My shops</h1>
      <p className="mb-6 text-sm text-gray-500">
        Shops are created by the admin and assigned to you. Open a shop to manage its product listings.
      </p>

      {shops.length === 0 ? (
        <EmptyState title="No shops assigned yet" hint="Ask an admin to create a shop and assign it to you." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              href={`/dashboard/shops/${shop.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-900">{shop.name}</h2>
                {shop.is_active ? <Badge color="green">Active</Badge> : <Badge color="amber">Inactive</Badge>}
              </div>
              {shop.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{shop.description}</p>}
              <p className="mt-4 text-sm text-gray-600">{shop.products_count ?? 0} products listed</p>
              <p className="mt-1 text-sm font-medium text-indigo-600">Manage listings →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
