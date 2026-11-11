"use client";

import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { ImageUploader, emptyUploader, type UploaderValue } from "@/components/ImageUploader";
import { ApiError, api } from "@/lib/api";
import type { Category, Product, ProductType } from "@/lib/types";
import { useState } from "react";

interface VariationRow {
  id?: number;
  name: string;
  sku: string;
  attributes: { key: string; value: string }[];
}

interface Props {
  categories: Category[];
  product?: Product;
  onSaved: (product: Product) => void;
  onCancel: () => void;
}

function toRows(product?: Product): VariationRow[] {
  if (!product?.variations?.length) return [{ name: "", sku: "", attributes: [{ key: "", value: "" }] }];
  return product.variations.map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku ?? "",
    attributes: Object.entries(v.attributes ?? {}).map(([key, value]) => ({ key, value })),
  }));
}

export function ProductForm({ categories, product, onSaved, onCancel }: Props) {
  const editing = !!product;
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.category?.id ? String(product.category.id) : "");
  const [type, setType] = useState<ProductType>(product?.type ?? "simple");
  const [images, setImages] = useState<UploaderValue>(emptyUploader);
  const [variations, setVariations] = useState<VariationRow[]>(toRows(product));
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const addVariation = () => setVariations([...variations, { name: "", sku: "", attributes: [{ key: "", value: "" }] }]);
  const removeVariation = (i: number) => setVariations(variations.filter((_, idx) => idx !== i));
  const updateVariation = (i: number, patch: Partial<VariationRow>) =>
    setVariations(variations.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(undefined);

    const form = new FormData();
    form.set("name", name);
    form.set("description", description ?? "");
    if (categoryId) form.set("category_id", categoryId);
    if (!editing) form.set("type", type);

    if (type === "variable") {
      const vars = variations
        .filter((v) => v.name.trim())
        .map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku || null,
          attributes: Object.fromEntries(v.attributes.filter((a) => a.key.trim()).map((a) => [a.key, a.value])),
        }));
      form.set("variations", JSON.stringify(vars));
    }

    // Images (upload happens now, as part of save).
    images.files.forEach((file) => form.append("images[]", file));
    if (editing) form.set("removed_image_ids", JSON.stringify(images.removedIds));

    const featured = images.featured;
    if (featured?.type === "new") form.set("featured_new_index", String(featured.index));
    else if (featured?.type === "existing") form.set("featured_image_id", String(featured.id));
    else if (!editing && images.files.length > 0) form.set("featured_new_index", "0");

    if (editing) form.set("_method", "PUT");

    try {
      const path = editing ? `/products/${product!.id}` : "/products";
      const res = await api.postForm<{ data: Product }>(path, form);
      onSaved(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="bg-sale/5 px-3 py-2 text-sm text-maroon">{error}</div>}

      <Field label="Product name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as ProductType)} disabled={editing}>
            <option value="simple">Simple</option>
            <option value="variable">Variable</option>
          </Select>
        </Field>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-ink">Images</p>
        <ImageUploader existing={product?.images} value={images} onChange={setImages} />
      </div>

      <Field label="Description">
        <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      {type === "variable" && (
        <div className="border border-line p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Variations</p>
            <Button type="button" size="sm" variant="secondary" onClick={addVariation}>+ Add</Button>
          </div>
          <p className="mb-3 text-xs text-muted">
            Defines the shared structure (e.g. Red / M). Shop owners set prices per variation when listing.
          </p>
          <div className="space-y-3">
            {variations.map((v, i) => (
              <div key={i} className="bg-cream p-3">
                <div className="flex gap-2">
                  <Input placeholder="Variation name (e.g. Red / M)" value={v.name} onChange={(e) => updateVariation(i, { name: e.target.value })} />
                  <Input placeholder="SKU" value={v.sku} onChange={(e) => updateVariation(i, { sku: e.target.value })} className="w-32" />
                  {variations.length > 1 && (
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeVariation(i)}>✕</Button>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {v.attributes.map((attr, ai) => (
                    <div key={ai} className="flex gap-2">
                      <Input
                        placeholder="Attribute (Color)"
                        value={attr.key}
                        className="text-xs"
                        onChange={(e) => {
                          const attrs = [...v.attributes];
                          attrs[ai] = { ...attr, key: e.target.value };
                          updateVariation(i, { attributes: attrs });
                        }}
                      />
                      <Input
                        placeholder="Value (Red)"
                        value={attr.value}
                        className="text-xs"
                        onChange={(e) => {
                          const attrs = [...v.attributes];
                          attrs[ai] = { ...attr, value: e.target.value };
                          const isLast = ai === v.attributes.length - 1;
                          if (isLast && e.target.value) attrs.push({ key: "", value: "" });
                          updateVariation(i, { attributes: attrs });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Update product" : "Create product"}</Button>
      </div>
    </form>
  );
}
