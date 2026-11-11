"use client";

import { ListingForm } from "@/components/ListingForm";
import { Modal } from "@/components/Modal";
import { Badge, Button, EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { priceRange } from "@/lib/format";
import type { Paginated, Shop, ShopProduct } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ManageShop() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [listings, setListings] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ShopProduct | null>(null);

  const loadListings = useCallback(() => {
    api.get<Paginated<ShopProduct>>(`/shops/${slug}/products`, { per_page: 100 }).then((r) => setListings(r.data));
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<{ data: Shop }>(`/my/shops/${slug}`),
      api.get<Paginated<ShopProduct>>(`/shops/${slug}/products`, { per_page: 100 }),
    ])
      .then(([s, l]) => {
        setShop(s.data);
        setListings(l.data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const openEdit = async (sp: ShopProduct) => {
    const res = await api.get<{ data: ShopProduct }>(`/shop-products/${sp.id}`);
    setEditing(res.data);
  };

  const toggleActive = async (sp: ShopProduct) => {
    await api.put(`/shop-products/${sp.id}`, { is_active: !sp.is_active });
    loadListings();
  };

  const remove = async (sp: ShopProduct) => {
    if (!confirm(`Remove "${sp.product?.name}" from this shop?`)) return;
    await api.delete(`/shop-products/${sp.id}`);
    loadListings();
  };

  if (loading) return <Spinner />;
  if (!shop) return <EmptyState title="Shop not found" />;

  return (
    <div>
      <nav className="mb-4 text-sm text-muted">
        <Link href="/dashboard" className="hover:text-brand-red">My shops</Link> / <span className="text-ink">{shop.name}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{shop.name}</h1>
          <p className="text-sm text-muted">{listings.length} products listed</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/shops/${shop.slug}/orders`} className="border border-line px-3 py-2 text-sm text-ink hover:bg-cream">
            Orders
          </Link>
          <Link href={`/shops/${shop.slug}`} className="border border-line px-3 py-2 text-sm text-ink hover:bg-cream">
            View storefront
          </Link>
          <Link href="/dashboard/catalog" className="bg-brand-red px-3 py-2 text-sm font-medium text-white hover:bg-maroon">
            + Add products
          </Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="No products listed" hint="Add products from the shared catalog." />
      ) : (
        <div className="overflow-hidden border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {listings.map((sp) => (
                <tr key={sp.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{sp.product?.name}</p>
                    <p className="text-xs text-muted">{sp.product?.category?.name ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {sp.is_variable ? <Badge color="indigo">Variable</Badge> : <Badge>Simple</Badge>}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{priceRange(sp.price_from, sp.price_to)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(sp)}>
                      {sp.is_active ? <Badge color="green">Visible</Badge> : <Badge color="amber">Hidden</Badge>}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(sp)}>Edit</Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => remove(sp)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit listing" wide>
        {editing && editing.product && (
          <ListingForm
            product={editing.product}
            shopProduct={editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              loadListings();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
