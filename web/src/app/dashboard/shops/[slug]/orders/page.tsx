"use client";

import { Badge, EmptyState, Select, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Order, OrderStatus, Paginated, Shop } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const statusColor: Record<OrderStatus, "amber" | "green" | "red"> = {
  pending: "amber",
  completed: "green",
  cancelled: "red",
};

export default function ShopOrders() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<{ data: Shop }>(`/my/shops/${slug}`),
      api.get<Paginated<Order>>(`/shops/${slug}/orders`, { per_page: 50 }),
    ])
      .then(([s, o]) => {
        setShop(s.data);
        setOrders(o.data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const changeStatus = async (order: Order, status: OrderStatus) => {
    const res = await api.patch<{ data: Order }>(`/orders/${order.id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: res.data.status } : o)));
  };

  if (loading) return <Spinner />;
  if (!shop) return <EmptyState title="Shop not found" />;

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-indigo-600">My shops</Link> /{" "}
        <Link href={`/dashboard/shops/${slug}`} className="hover:text-indigo-600">{shop.name}</Link> /{" "}
        <span className="text-gray-700">Orders</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders — {shop.name}</h1>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" hint="Orders placed in this shop will appear here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{order.reference}</p>
                  <p className="text-xs text-gray-500">
                    {order.customer?.name} · {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={statusColor[order.status]}>{order.status}</Badge>
                  <span className="font-semibold text-gray-900">{money(order.total)}</span>
                  <Select value={order.status} onChange={(e) => changeStatus(order, e.target.value as OrderStatus)} className="w-36">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-gray-700">
                      {item.product_name}
                      {item.variation_name && <span className="text-gray-400"> ({item.variation_name})</span>}
                      <span className="ml-2 text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="text-gray-600">{money(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
