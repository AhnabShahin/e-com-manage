"use client";

import { useRef, useState } from "react";

/**
 * Image with hover-to-zoom. On desktop, moving the cursor over the image magnifies
 * the area under the pointer; on touch it just shows the image.
 */
export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => setZooming(false)}
      onMouseMove={onMove}
      className="aspect-square w-full cursor-zoom-in overflow-hidden border border-line bg-cream"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-150 ease-out"
        style={{ transform: zooming ? "scale(2)" : "scale(1)", transformOrigin: origin }}
        draggable={false}
      />
    </div>
  );
}
