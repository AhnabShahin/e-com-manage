"use client";

import { Modal } from "@/components/Modal";
import { Badge, Button, EmptyState, Field, Input, Select, Spinner, Textarea } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import type { Paginated, Shop, User } from "@/lib/types";
import { useEffect, useState } from "react";

interface ShopForm {
  name: string;
  description: string;
  owner_id: string;
  is_active: boolean;
}

const empty: ShopForm = { name: "", description: "", owner_id: "", is_active: true };

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [owners, setOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Shop | null>(null);
  const [form, setForm] = useState<ShopForm>(empty);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<Paginated<Shop>>("/admin/shops", { per_page: 50 }).then((r) => setShops(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get<Paginated<User>>("/admin/users", { per_page: 100, role: "shop_owner" }).then((r) => setOwners(r.data));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError(undefined);
    setModalOpen(true);
  };

  const openEdit = (shop: Shop) => {
    setEditing(shop);
    setForm({
      name: shop.name,
      description: shop.description ?? "",
      owner_id: shop.owner?.id ? String(shop.owner.id) : "",
      is_active: shop.is_active,
    });
    setError(undefined);
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(undefined);
    const payload = {
      name: form.name,
      description: form.description || null,
      owner_id: form.owner_id ? Number(form.owner_id) : null,
      is_active: form.is_active,
    };
    try {
      if (editing) await api.put(`/admin/shops/${editing.slug}`, payload);
      else await api.post("/admin/shops", payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (shop: Shop) => {
    if (!confirm(`Delete "${shop.name}"? This removes its listings too.`)) return;
    await api.delete(`/admin/shops/${shop.slug}`);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Shops</h1>
        <Button onClick={openCreate}>+ New shop</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : shops.length === 0 ? (
        <EmptyState title="No shops yet" hint="Create your first shop." />
      ) : (
        <div className="overflow-hidden border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Shop</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {shops.map((shop) => (
                <tr key={shop.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{shop.name}</p>
                    <p className="text-xs text-muted">/{shop.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{shop.owner?.name ?? <span className="text-muted">Unassigned</span>}</td>
                  <td className="px-4 py-3 text-muted">{shop.products_count ?? 0}</td>
                  <td className="px-4 py-3">
                    {shop.is_active ? <Badge color="green">Active</Badge> : <Badge color="amber">Inactive</Badge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(shop)}>Edit</Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => remove(shop)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit shop" : "New shop"}>
        <form onSubmit={save} className="space-y-4">
          {error && <div className="bg-sale/5 px-3 py-2 text-sm text-maroon">{error}</div>}
          <Field label="Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Owner">
            <Select value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}>
              <option value="">Unassigned</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (visible to customers)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
