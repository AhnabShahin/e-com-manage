"use client";

import { clsx } from "@/lib/clsx";
import type { ProductImage } from "@/lib/types";
import { useEffect, useMemo } from "react";

/** A reference to whichever image is the feature image. */
export type Featured = { type: "existing"; id: number } | { type: "new"; index: number } | null;

export interface UploaderValue {
  files: File[];
  removedIds: number[];
  featured: Featured;
}

export const emptyUploader: UploaderValue = { files: [], removedIds: [], featured: null };

export function ImageUploader({
  existing = [],
  value,
  onChange,
}: {
  existing?: ProductImage[];
  value: UploaderValue;
  onChange: (v: UploaderValue) => void;
}) {
  // Object URLs for new-file previews (revoked on change/unmount).
  const previews = useMemo(() => value.files.map((f) => URL.createObjectURL(f)), [value.files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const visibleExisting = existing.filter((img) => !value.removedIds.includes(img.id));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    onChange({ ...value, files: [...value.files, ...Array.from(list)] });
  };

  const removeExisting = (id: number) => {
    const featured: Featured = value.featured?.type === "existing" && value.featured.id === id ? null : value.featured;
    onChange({ ...value, removedIds: [...value.removedIds, id], featured });
  };

  const removeNew = (index: number) => {
    const files = value.files.filter((_, i) => i !== index);
    let featured = value.featured;
    if (featured?.type === "new") {
      if (featured.index === index) featured = null;
      else if (featured.index > index) featured = { type: "new", index: featured.index - 1 };
    }
    onChange({ ...value, files, featured });
  };

  const isFeatured = (ref: Featured) => {
    if (!value.featured || !ref) return false;
    if (value.featured.type === "existing" && ref.type === "existing") return value.featured.id === ref.id;
    if (value.featured.type === "new" && ref.type === "new") return value.featured.index === ref.index;
    return false;
  };

  // Default: if nothing explicitly featured, the first existing featured image, else the first tile.
  const effectiveFeatured: Featured =
    value.featured ??
    (visibleExisting.find((i) => i.is_featured)
      ? { type: "existing", id: visibleExisting.find((i) => i.is_featured)!.id }
      : visibleExisting[0]
        ? { type: "existing", id: visibleExisting[0].id }
        : value.files[0]
          ? { type: "new", index: 0 }
          : null);

  const Tile = ({ src, featured, onFeature, onRemove }: { src: string; featured: boolean; onFeature: () => void; onRemove: () => void }) => (
    <div className={clsx("relative overflow-hidden border", featured ? "border-maroon ring-2 ring-brand-red/20" : "border-line")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="aspect-square w-full object-cover" />
      {featured && (
        <span className="absolute left-1 top-1 rounded bg-brand-red px-1.5 py-0.5 text-[10px] font-medium text-white">Feature</span>
      )}
      <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/40 p-1">
        <button type="button" onClick={onFeature} className="rounded px-1 text-[10px] text-white hover:bg-white/20">
          Set feature
        </button>
        <button type="button" onClick={onRemove} className="rounded px-1 text-[10px] text-white hover:bg-sale">
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {visibleExisting.map((img) => (
          <Tile
            key={`e${img.id}`}
            src={img.url}
            featured={isFeatured({ type: "existing", id: img.id }) || (!value.featured && effectiveFeatured?.type === "existing" && effectiveFeatured.id === img.id)}
            onFeature={() => onChange({ ...value, featured: { type: "existing", id: img.id } })}
            onRemove={() => removeExisting(img.id)}
          />
        ))}
        {value.files.map((_, i) => (
          <Tile
            key={`n${i}`}
            src={previews[i]}
            featured={isFeatured({ type: "new", index: i }) || (!value.featured && effectiveFeatured?.type === "new" && effectiveFeatured.index === i)}
            onFeature={() => onChange({ ...value, featured: { type: "new", index: i } })}
            onRemove={() => removeNew(i)}
          />
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center border-2 border-dashed border-line text-muted hover:border-brand-red/50 hover:text-maroon">
          <span className="text-2xl leading-none">+</span>
          <span className="mt-1 text-[10px]">Add image</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        </label>
      </div>
      <p className="mt-2 text-xs text-muted">
        Images upload only when you save. Click “Set feature” to choose the main image shown to customers.
      </p>
    </div>
  );
}
