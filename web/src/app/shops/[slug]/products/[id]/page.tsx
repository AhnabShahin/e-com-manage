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
      <nav className="mb-4 text-sm text-muted">
        <Link href="/shops" className="hover:text-brand-red">Shops</Link> /{" "}
        <Link href={`/shops/${slug}`} className="hover:text-brand-red">{sp.shop?.name}</Link> /{" "}
        <span className="text-ink">{sp.product?.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {mainImage ? (
            <ImageZoom src={mainImage} alt={sp.product?.name ?? ""} />
          ) : (
            <div className="flex aspect-square items-center justify-center border border-line bg-cream text-line">
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
                  className={clsx("h-16 w-16 overflow-hidden border", i === activeImg ? "border-maroon ring-2 ring-brand-red/20" : "border-line")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-muted">Hover the image to zoom.</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            {sp.product?.category && <Badge>{sp.product.category.name}</Badge>}
            {sp.is_variable && <Badge color="indigo">Variable</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink">{sp.product?.name}</h1>

          <p className="mt-4 text-2xl font-semibold text-ink">
            {sp.is_variable && !selected ? priceRange(sp.price_from, sp.price_to) : money(price)}
          </p>
          {stock !== null && stock !== undefined && (
            <p className="mt-1 text-sm text-muted">{stock > 0 ? `${stock} in stock` : "Out of stock"}</p>
          )}

          {(sp.details || sp.product?.description) && (
            <p className="mt-5 whitespace-pre-line text-muted">{sp.details || sp.product?.description}</p>
          )}

          {sp.is_variable && sp.variations && sp.variations.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink">Choose an option</p>
              <div className="flex flex-wrap gap-2">
                {sp.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className={clsx(
                      "border px-3 py-2 text-sm transition",
                      selected?.id === v.id ? "border-brand-red bg-cream text-maroon" : "border-line text-ink hover:border-muted",
                    )}
                  >
                    <span className="font-medium">{v.variation?.name}</span>
                    <span className="ml-2 text-muted">{money(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button className="mt-8" onClick={addToCart} disabled={stock === 0 || (sp.is_variable && !selected)}>
            {added ? "Added ✓" : "Add to cart"}
          </Button>
          <p className="mt-2 text-xs text-muted">
            <Link href="/cart" className="text-brand-red hover:underline">Go to cart →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
