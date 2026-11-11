"use client";

import { Badge, EmptyState, Input, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import type { Paginated, User } from "@/lib/types";
import { useEffect, useState } from "react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get<Paginated<User>>("/admin/customers", { search, per_page: 50 })
      .then((r) => setCustomers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleActive = async (user: User) => {
    await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Customers</h1>
          <p className="text-sm text-muted">Customers self-register — deactivate an account to block sign-in.</p>
        </div>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…" className="sm:w-64" />
      </div>

      {loading ? (
        <Spinner />
      ) : customers.length === 0 ? (
        <EmptyState title="No customers yet" hint="Customers appear here once they register." />
      ) : (
        <div className="overflow-hidden border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-muted">{c.orders_count ?? 0}</td>
                  <td className="px-4 py-3 text-muted">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {c.is_active ? <Badge color="green">Active</Badge> : <Badge color="amber">Disabled</Badge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleActive(c)} className="text-xs font-semibold uppercase tracking-wide text-brand-red hover:underline">
                      {c.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
