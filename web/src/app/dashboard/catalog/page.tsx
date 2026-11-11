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
          <h1 className="text-2xl font-bold text-ink">Shared catalog</h1>
          <p className="text-sm text-muted">Add catalog products to your shop, or create your own.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Create product</Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 border border-line bg-cream/50 p-3">
        <Input
          placeholder="Search catalog…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs border-line bg-white"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Adding to</span>
          <Select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)} className="w-48 border-line bg-white">
            <option value="">Select a shop…</option>
            {shops.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </div>
        <span className="ml-auto text-xs text-muted">{products.length} product{products.length === 1 ? "" : "s"}</span>
      </div>

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState title="No products in catalog" hint="Create the first product." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {products.map((p) => (
            <div key={p.id} className="group flex flex-col border border-line bg-white transition hover:border-brand-red/30">
              <div className="aspect-square overflow-hidden bg-cream">
                {p.primary_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.primary_image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase tracking-wide text-line">No image</div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-red">
                    {p.category?.name ?? "Uncategorized"}
                  </p>
                  {p.type === "variable" && <Badge color="indigo">Variable</Badge>}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-ink">{p.name}</h3>
                <p className="mt-0.5 text-[11px] text-muted">by {p.creator?.name ?? "—"}</p>
                {p.description && <p className="mt-1.5 line-clamp-2 text-xs text-muted">{p.description}</p>}

                <div className="mt-3 flex-1" />

                {p.listed_in_shop ? (
                  <div className="flex items-center justify-center border border-line bg-cream/60 py-2">
                    <Badge color="green">Already in this shop</Badge>
                  </div>
                ) : (
                  <Button size="sm" variant="secondary" disabled={!selectedShop} onClick={() => openListing(p)} className="w-full">
                    {selectedShop ? `Add to ${shop?.name}` : "Pick a shop first"}
                  </Button>
                )}
              </div>
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
