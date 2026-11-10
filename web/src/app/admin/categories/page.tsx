"use client";

import { Button, EmptyState, Input, Spinner } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import type { Category, Paginated } from "@/lib/types";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<Paginated<Category>>("/categories").then((r) => setCategories(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(undefined);
    try {
      await api.post("/admin/categories", { name });
      setName("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    await api.delete(`/admin/categories/${c.id}`);
    load();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Categories</h1>

      <form onSubmit={add} className="mb-6 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" required />
        <Button type="submit" disabled={saving}>Add</Button>
      </form>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <Spinner />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" />
      ) : (
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.products_count ?? 0} products</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => remove(c)}>Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
