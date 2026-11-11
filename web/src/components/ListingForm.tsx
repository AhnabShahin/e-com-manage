"use client";

import { Button, Field, Input, Textarea } from "@/components/ui";
import { ApiError, api } from "@/lib/api";
import type { Product, ShopProduct } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

interface VarRow {
  product_variation_id: number;
  name: string;
  include: boolean;
  price: string;
  stock: string;
}

interface Props {
  product: Product;
  shopSlug?: string;
  shopProduct?: ShopProduct;
  onSaved: () => void;
  onCancel: () => void;
}

function buildRows(product: Product, shopProduct?: ShopProduct): VarRow[] {
  return (product.variations ?? []).map((v) => {
    const existing = shopProduct?.variations?.find((sv) => sv.product_variation_id === v.id);
    return {
      product_variation_id: v.id,
      name: v.name,
      include: shopProduct ? !!existing : true,
      price: existing ? String(existing.price) : "",
      stock: existing ? String(existing.stock) : "0",
    };
  });
}

export function ListingForm({ product, shopSlug, shopProduct, onSaved, onCancel }: Props) {
  const editing = !!shopProduct;
  const isVariable = product.type === "variable";
  const [price, setPrice] = useState(shopProduct?.price ?? "");
  const [details, setDetails] = useState(shopProduct?.details ?? "");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [removeThumb, setRemoveThumb] = useState(false);
  const [rows, setRows] = useState<VarRow[]>(buildRows(product, shopProduct));
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const preview = useMemo(() => (thumbFile ? URL.createObjectURL(thumbFile) : null), [thumbFile]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const currentThumb = !removeThumb && !thumbFile ? shopProduct?.thumbnail ?? null : null;
  const updateRow = (i: number, patch: Partial<VarRow>) => setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(undefined);

    const form = new FormData();
    form.set("details", details ?? "");

    if (isVariable) {
      const included = rows.filter((r) => r.include && r.price !== "");
      if (included.length === 0) {
        setError("Add a price for at least one variation.");
        setSaving(false);
        return;
      }
      form.set(
        "variations",
        JSON.stringify(included.map((r) => ({ product_variation_id: r.product_variation_id, price: Number(r.price), stock: Number(r.stock || 0) }))),
      );
    } else {
      form.set("price", price === "" ? "0" : String(Number(price)));
    }

    if (thumbFile) form.set("thumbnail", thumbFile);
    if (editing && removeThumb && !thumbFile) form.set("remove_thumbnail", "1");

    try {
      if (editing) {
        form.set("_method", "PUT");
        await api.postForm(`/shop-products/${shopProduct!.id}`, form);
      } else {
        form.set("product_id", String(product.id));
        await api.postForm(`/shops/${shopSlug}/products`, form);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="bg-sale/5 px-3 py-2 text-sm text-maroon">{error}</div>}

      <div className="bg-cream p-3 text-sm">
        <span className="font-medium text-ink">{product.name}</span>
        <span className="ml-2 text-muted">{isVariable ? "Variable product" : "Simple product"}</span>
      </div>

      {!isVariable && (
        <Field label="Your price (USD)">
          <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </Field>
      )}

      {isVariable && (
        <div className="border border-line p-3">
          <p className="mb-2 text-sm font-medium text-ink">Variation pricing</p>
          <p className="mb-3 text-xs text-muted">Tick the variations you want to sell and set a price for each.</p>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={r.product_variation_id} className="flex items-center gap-2">
                <input type="checkbox" checked={r.include} onChange={(e) => updateRow(i, { include: e.target.checked })} />
                <span className="w-28 shrink-0 text-sm text-ink">{r.name}</span>
                <Input type="number" min="0" step="0.01" placeholder="Price" value={r.price} disabled={!r.include} onChange={(e) => updateRow(i, { price: e.target.value })} />
                <Input type="number" min="0" placeholder="Stock" value={r.stock} disabled={!r.include} onChange={(e) => updateRow(i, { stock: e.target.value })} className="w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-1 text-sm font-medium text-ink">Shop thumbnail (optional)</p>
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden border border-line bg-cream">
            {(preview || currentThumb) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview || currentThumb || ""} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted">Catalog image</div>
            )}
          </div>
          <div className="space-y-1">
            <label className="inline-block cursor-pointer border border-line px-3 py-1.5 text-xs text-ink hover:bg-cream">
              {thumbFile ? "Change file" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { setThumbFile(e.target.files?.[0] ?? null); setRemoveThumb(false); }} />
            </label>
            {(currentThumb || thumbFile) && (
              <button
                type="button"
                onClick={() => { setThumbFile(null); setRemoveThumb(true); }}
                className="ml-2 text-xs text-sale hover:underline"
              >
                Remove
              </button>
            )}
            <p className="text-[11px] text-muted">Overrides the catalog image for this shop.</p>
          </div>
        </div>
      </div>

      <Field label="Shop-specific details (optional)">
        <Textarea rows={2} value={details} onChange={(e) => setDetails(e.target.value)} />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Update listing" : "Add to shop"}</Button>
      </div>
    </form>
  );
}
