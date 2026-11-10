"use client";

import { Button, EmptyState } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, total, setQuantity, remove } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Group lines by shop for display.
  const byShop = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.shopSlug] ??= []).push(item);
    return acc;
  }, {});

  const goCheckout = () => {
    if (!user) router.push("/login?redirect=/checkout");
    else router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Your cart</h1>
        <EmptyState title="Your cart is empty" hint="Browse shops and add some products." />
        <div className="mt-4">
          <Link href="/shops" className="text-indigo-600 hover:underline">← Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your cart</h1>

      <div className="space-y-6">
        {Object.entries(byShop).map(([slug, lines]) => (
          <div key={slug} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
              <Link href={`/shops/${slug}`} className="hover:text-indigo-600">{lines[0].shopName}</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {lines.map((item) => (
                <div key={item.key} className="flex items-center gap-4 px-4 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {item.variationName && <p className="text-xs text-gray-500">{item.variationName}</p>}
                    <p className="text-sm text-gray-500">{money(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setQuantity(item.key, item.quantity - 1)} className="h-7 w-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">−</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => setQuantity(item.key, item.quantity + 1)} className="h-7 w-7 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">+</button>
                  </div>
                  <p className="w-20 text-right font-medium text-gray-900">{money(item.price * item.quantity)}</p>
                  <button onClick={() => remove(item.key)} className="text-xs text-red-600 hover:underline">Remove</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div>
          <p className="text-sm text-gray-500">Total ({Object.keys(byShop).length} shop{Object.keys(byShop).length > 1 ? "s" : ""})</p>
          <p className="text-2xl font-bold text-gray-900">{money(total)}</p>
        </div>
        <Button onClick={goCheckout}>Proceed to checkout</Button>
      </div>
      {Object.keys(byShop).length > 1 && (
        <p className="mt-2 text-xs text-gray-400">Items from different shops are placed as separate orders.</p>
      )}
    </div>
  );
}
