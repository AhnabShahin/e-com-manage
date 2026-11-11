"use client";

import { Badge, EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import type { Order, OrderStatus, Paginated } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusColor: Record<OrderStatus, "amber" | "green" | "red"> = {
  pending: "amber",
  completed: "green",
  cancelled: "red",
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Paginated<Order>>("/orders", { per_page: 50 }).then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">My orders</h1>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" hint="Your placed orders will appear here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="overflow-hidden border border-line bg-white">
              <div className="flex items-center justify-between border-b border-cream bg-cream px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{order.reference}</p>
                  <p className="text-xs text-muted">
                    {order.shop?.name} · {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={statusColor[order.status]}>{order.status}</Badge>
                  <span className="font-semibold text-ink">{money(order.total)}</span>
                </div>
              </div>
              <div className="divide-y divide-cream">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-ink">
                      {item.product_name}
                      {item.variation_name && <span className="text-muted"> ({item.variation_name})</span>}
                      <span className="ml-2 text-muted">× {item.quantity}</span>
                    </span>
                    <span className="text-muted">{money(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/shops" className="text-brand-red hover:underline">← Continue shopping</Link>
      </div>
    </div>
  );
}
