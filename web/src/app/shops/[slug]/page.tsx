"use client";

import { Badge, EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { priceRange } from "@/lib/format";
import type { Paginated, Shop, ShopProduct } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShopStorefront() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<{ data: Shop }>(`/storefront/shops/${slug}`),
      api.get<Paginated<ShopProduct>>(`/storefront/shops/${slug}/products`, { per_page: 24 }),
    ])
      .then(([s, p]) => {
        setShop(s.data);
        setProducts(p.data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (notFound || !shop) return <EmptyState title="Shop not found" hint="It may be inactive or removed." />;

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/shops" className="hover:text-indigo-600">
          Shops
        </Link>{" "}
        / <span className="text-gray-700">{shop.name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
        {shop.description && <p className="mt-1 text-gray-600">{shop.description}</p>}
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products yet" hint="This shop hasn't listed any products." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((sp) => (
            <Link
              key={sp.id}
              href={`/shops/${shop.slug}/products/${sp.id}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-indigo-300 hover:shadow-sm"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                {sp.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sp.thumbnail} alt={sp.product?.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">{sp.product?.name}</h3>
                  {sp.is_variable && <Badge color="indigo">Options</Badge>}
                </div>
                {sp.product?.category && <p className="mt-0.5 text-xs text-gray-400">{sp.product.category.name}</p>}
                <p className="mt-2 font-semibold text-gray-900">{priceRange(sp.price_from, sp.price_to)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
