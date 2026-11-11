"use client";

import { Button, EmptyState, Spinner } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import type { Order } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string>();
  const [placed, setPlaced] = useState<Order[] | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login?redirect=/checkout");
    else if (user.role !== "customer") router.replace("/");
  }, [user, loading, router]);

  const placeOrder = async () => {
    setPlacing(true);
    setError(undefined);
    try {
      const res = await api.post<{ data: Order[] }>("/orders", {
        items: items.map((i) => ({
          shop_product_id: i.shopProductId,
          shop_product_variation_id: i.variationId,
          quantity: i.quantity,
        })),
      });
      setPlaced(res.data);
      clear();
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Checkout failed.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading || !user) return <Spinner />;

  if (placed) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">✓</div>
        <h1 className="text-2xl font-bold text-ink">Order placed!</h1>
        <p className="mt-2 text-muted">
          {placed.length} order{placed.length > 1 ? "s" : ""} created:{" "}
          {placed.map((o) => o.reference).join(", ")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/account/orders" className="bg-brand-red px-5 py-2.5 font-medium text-white hover:bg-maroon">
            View my orders
          </Link>
          <Link href="/shops" className="border border-line px-5 py-2.5 font-medium text-ink hover:bg-cream">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty" hint="Add products before checking out." />;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Checkout</h1>
      {error && <div className="mb-4 bg-sale/5 px-3 py-2 text-sm text-maroon">{error}</div>}

      <div className="overflow-hidden border border-line bg-white">
        <div className="divide-y divide-cream">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <span className="font-medium text-ink">{item.name}</span>
                {item.variationName && <span className="ml-1 text-muted">({item.variationName})</span>}
                <span className="ml-2 text-muted">× {item.quantity}</span>
                <span className="ml-2 text-xs text-muted">· {item.shopName}</span>
              </div>
              <span className="font-medium text-ink">{money(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-cream px-4 py-3">
          <span className="font-semibold text-ink">Total</span>
          <span className="text-xl font-bold text-ink">{money(total)}</span>
        </div>
      </div>

      <div className="mt-4 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        This is a demo — no payment is collected. Placing the order records it for you and the shop.
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link href="/cart" className="border border-line px-5 py-2.5 text-ink hover:bg-cream">Back to cart</Link>
        <Button onClick={placeOrder} disabled={placing}>{placing ? "Placing…" : "Place order"}</Button>
      </div>
    </div>
  );
}
