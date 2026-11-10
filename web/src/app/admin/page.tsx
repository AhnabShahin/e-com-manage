"use client";

import { Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import type { Paginated } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  shops: number;
  products: number;
  owners: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Paginated<unknown>>("/admin/shops", { per_page: 1 }),
      api.get<Paginated<unknown>>("/products", { per_page: 1 }),
      api.get<Paginated<unknown>>("/admin/users", { per_page: 1 }),
    ]).then(([s, p, u]) =>
      setStats({ shops: s.meta.total, products: p.meta.total, owners: u.meta.total }),
    );
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: "Shops", value: stats.shops, href: "/admin/shops" },
    { label: "Catalog products", value: stats.products, href: "/admin/products" },
    { label: "Staff accounts", value: stats.owners, href: "/admin/users" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{c.value}</p>
            <p className="mt-3 text-sm text-indigo-600">Manage →</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">How the shared catalog works</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-600">
          <li>Products created here (or by any shop owner) join one shared catalog.</li>
          <li>Shop owners list catalog products in their shops with their own prices and images.</li>
          <li>Customers only see products that are actively listed in a shop.</li>
        </ul>
      </div>
    </div>
  );
}
