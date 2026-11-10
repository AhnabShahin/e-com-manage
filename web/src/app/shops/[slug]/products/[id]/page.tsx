"use client";

import { ImageZoom } from "@/components/ImageZoom";
import { Badge, Button, EmptyState, Spinner } from "@/components/ui";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { clsx } from "@/lib/clsx";
import { money, priceRange } from "@/lib/format";
import type { ShopProduct, ShopProductVariation } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ProductDetail() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { add } = useCart();
  const [sp, setSp] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ShopProductVariation | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<{ data: ShopProduct }>(`/storefront/shops/${slug}/products/${id}`)
      .then((res) => {
        setSp(res.data);
        if (res.data.variations && res.data.variations.length > 0) setSelected(res.data.variations[0]);
      })
      .catch(() => setSp(null))
      .finally(() => setLoading(false));
  }, [slug, id]);

  // Gallery: catalog images, falling back to the shop thumbnail.
  const gallery = useMemo(() => {
    const imgs = sp?.product?.images?.map((i) => i.url) ?? [];
    if (imgs.length) return imgs;
    return sp?.thumbnail ? [sp.thumbnail] : [];
  }, [sp]);

  if (loading) return <Spinner />;
  if (!sp) return <EmptyState title="Product not found" />;

  const price = sp.is_variable ? selected?.price ?? null : sp.price;
  const stock = sp.is_variable ? selected?.stock : null;
  const mainImage = gallery[activeImg] ?? null;

  const addToCart = () => {
    add({
      shopProductId: sp.id,
      variationId: sp.is_variable ? selected?.product_variation_id ?? null : null,
      name: sp.product?.name ?? "Product",
      variationName: sp.is_variable ? selected?.variation?.name ?? null : null,
      price: Number(price ?? 0),
      shopId: sp.shop?.id ?? sp.shop_id,
      shopName: sp.shop?.name ?? "",
      shopSlug: slug,
      thumbnail: mainImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/shops" className="hover:text-indigo-600">Shops</Link> /{" "}
        <Link href={`/shops/${slug}`} className="hover:text-indigo-600">{sp.shop?.name}</Link> /{" "}
        <span className="text-gray-700">{sp.product?.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {mainImage ? (
            <ImageZoom src={mainImage} alt={sp.product?.name ?? ""} />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-300">
              No image
            </div>
          )}
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((url, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImg(i)}
                  onClick={() => setActiveImg(i)}
                  className={clsx("h-16 w-16 overflow-hidden rounded-lg border", i === activeImg ? "border-indigo-500 ring-2 ring-indigo-200" : "border-gray-200")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">Hover the image to zoom.</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            {sp.product?.category && <Badge>{sp.product.category.name}</Badge>}
            {sp.is_variable && <Badge color="indigo">Variable</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{sp.product?.name}</h1>

          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {sp.is_variable && !selected ? priceRange(sp.price_from, sp.price_to) : money(price)}
          </p>
          {stock !== null && stock !== undefined && (
            <p className="mt-1 text-sm text-gray-500">{stock > 0 ? `${stock} in stock` : "Out of stock"}</p>
          )}

          {(sp.details || sp.product?.description) && (
            <p className="mt-5 whitespace-pre-line text-gray-600">{sp.details || sp.product?.description}</p>
          )}

          {sp.is_variable && sp.variations && sp.variations.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-gray-700">Choose an option</p>
              <div className="flex flex-wrap gap-2">
                {sp.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-sm transition",
                      selected?.id === v.id ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-300 text-gray-700 hover:border-gray-400",
                    )}
                  >
                    <span className="font-medium">{v.variation?.name}</span>
                    <span className="ml-2 text-gray-500">{money(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button className="mt-8" onClick={addToCart} disabled={stock === 0 || (sp.is_variable && !selected)}>
            {added ? "Added ✓" : "Add to cart"}
          </Button>
          <p className="mt-2 text-xs text-gray-400">
            <Link href="/cart" className="text-indigo-600 hover:underline">Go to cart →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
