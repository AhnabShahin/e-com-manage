"use client";

import { Modal } from "@/components/Modal";
import { Badge, Button, EmptyState, Field, Input, Select, Spinner } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import type { Paginated, Role, User } from "@/lib/types";
import { useEffect, useState } from "react";

type StaffRole = Extract<Role, "admin" | "shop_owner">;

interface UserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: StaffRole;
  is_active: boolean;
}

const empty: UserForm = { name: "", email: "", password: "", password_confirmation: "", role: "shop_owner", is_active: true };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(empty);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<Paginated<User>>("/admin/users", { per_page: 50 }).then((r) => setUsers(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError(undefined);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      password_confirmation: "",
      role: user.role === "admin" ? "admin" : "shop_owner",
      is_active: user.is_active,
    });
    setError(undefined);
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(undefined);
    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      is_active: form.is_active,
    };
    if (!editing) payload.role = form.role;
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }
    try {
      if (editing) await api.put(`/admin/users/${editing.id}`, payload);
      else await api.post("/admin/users", payload);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user: User) => {
    if (!confirm(`Delete ${user.name}? Their shops become unassigned.`)) return;
    await api.delete(`/admin/users/${user.id}`);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff accounts</h1>
          <p className="text-sm text-gray-500">Administrators and shop owners. Customers self-register.</p>
        </div>
        <Button onClick={openCreate}>+ New account</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <EmptyState title="No accounts yet" hint="Create an administrator or shop-owner account." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Shops</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge color={u.role === "admin" ? "indigo" : "gray"}>{u.role_label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.shops_count ?? 0}</td>
                  <td className="px-4 py-3">
                    {u.is_active ? <Badge color="green">Active</Badge> : <Badge color="amber">Disabled</Badge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => openEdit(u)}>Edit</Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => remove(u)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit account" : "New account"}>
        <form onSubmit={save} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {!editing && (
            <Field label="Role">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}>
                <option value="shop_owner">Shop owner</option>
                <option value="admin">Administrator</option>
              </Select>
            </Field>
          )}
          <Field label="Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label={editing ? "New password (leave blank to keep)" : "Password"}>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} />
          </Field>
          <Field label="Confirm password">
            <Input
              type="password"
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              required={!editing || form.password.length > 0}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (can sign in)
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
