"use client";

import { ListingForm } from "@/components/ListingForm";
import { Modal } from "@/components/Modal";
import { ProductForm } from "@/components/ProductForm";
import { Badge, Button, EmptyState, Input, Select, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import type { Category, Paginated, Product, Shop } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function CatalogBrowse() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [listing, setListing] = useState<Product | null>(null);

  const shop = shops.find((s) => String(s.id) === selectedShop);

  const loadProducts = useCallback(() => {
    setLoading(true);
    api
      .get<Paginated<Product>>("/products", { search, shop_id: selectedShop || undefined, per_page: 50 })
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [search, selectedShop]);

  useEffect(() => {
    api.get<{ data: Shop[] }>("/my/shops").then((r) => {
      setShops(r.data);
      if (r.data.length > 0) setSelectedShop(String(r.data[0].id));
    });
    api.get<Paginated<Category>>("/categories", { per_page: 100 }).then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const t = setTimeout(loadProducts, 250);
    return () => clearTimeout(t);
  }, [loadProducts]);

  const openListing = async (product: Product) => {
    // Load full product (variations) before listing.
    const res = await api.get<{ data: Product }>(`/products/${product.id}`);
    setListing(res.data);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shared catalog</h1>
          <p className="text-sm text-gray-500">Add catalog products to your shop, or create your own.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Create product</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input placeholder="Search catalog…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)} className="max-w-xs">
          <option value="">Select a shop to add to…</option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState title="No products in catalog" hint="Create the first product." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-400">{p.category?.name ?? "Uncategorized"} · by {p.creator?.name ?? "—"}</p>
                </div>
                {p.type === "variable" ? <Badge color="indigo">Variable</Badge> : <Badge>Simple</Badge>}
              </div>
              {p.description && <p className="mt-2 line-clamp-2 text-sm text-gray-500">{p.description}</p>}
              <div className="mt-4 flex-1" />
              {p.listed_in_shop ? (
                <Badge color="green">Already in this shop</Badge>
              ) : (
                <Button size="sm" variant="secondary" disabled={!selectedShop} onClick={() => openListing(p)}>
                  {selectedShop ? `Add to ${shop?.name}` : "Pick a shop first"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create catalog product" wide>
        <ProductForm
          categories={categories}
          onCancel={() => setCreateOpen(false)}
          onSaved={() => {
            setCreateOpen(false);
            loadProducts();
          }}
        />
      </Modal>

      <Modal open={!!listing} onClose={() => setListing(null)} title="Add to shop" wide>
        {listing && shop && (
          <ListingForm
            product={listing}
            shopSlug={shop.slug}
            onCancel={() => setListing(null)}
            onSaved={() => {
              setListing(null);
              loadProducts();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
