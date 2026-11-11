"use client";

import { Modal } from "@/components/Modal";
import { ProductForm } from "@/components/ProductForm";
import { Badge, Button, EmptyState, Input, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import type { Category, Paginated, Product } from "@/lib/types";
import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();

  const load = (q = "") => {
    setLoading(true);
    api.get<Paginated<Product>>("/products", { search: q, per_page: 50 }).then((r) => setProducts(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get<Paginated<Category>>("/categories", { per_page: 100 }).then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const openCreate = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  const openEdit = async (p: Product) => {
    // Fetch full product (with variations) before editing.
    const res = await api.get<{ data: Product }>(`/products/${p.id}`);
    setEditing(res.data);
    setModalOpen(true);
  };

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}" from the catalog? It will be removed from all shops.`)) return;
    await api.delete(`/products/${p.id}`);
    load(search);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Shared catalog</h1>
        <Button onClick={openCreate}>+ New product</Button>
      </div>

      <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 max-w-xs" />

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState title="No products" hint="Add a product to the shared catalog." />
      ) : (
        <div className="overflow-hidden border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Created by</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.type === "variable" ? (
                      <Badge color="indigo">Variable · {p.variations_count ?? 0}</Badge>
                    ) : (
                      <Badge>Simple</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{p.creator?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Edit</Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => remove(p)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit product" : "New catalog product"} wide>
        <ProductForm
          categories={categories}
          product={editing}
          onCancel={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load(search);
          }}
        />
      </Modal>
    </div>
  );
}
