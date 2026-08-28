"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatMXN } from "@/lib/site";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";

const AVAIL: Record<Product["availability"], string> = {
  "in-stock": "Disponible",
  "made-to-order": "Por encargo",
  "sold-out": "Agotado",
};

export function ProductCard({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[Math.min(1, product.colors.length - 1)]);

  return (
    <article className="group">
      <Link href={`/producto/${product.slug}`} data-cursor="VER PRODUCTO" className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-linen/50 ring-1 ring-ink/10">
          <BagSilhouette
            silhouette={product.silhouette}
            weave={product.weave}
            colorHex={color.hex}
            shadeHex={color.shade}
            className="h-full w-full p-8 transition-transform duration-700 ease-cinema group-hover:scale-[1.06] group-hover:-rotate-1"
          />
          <span className="absolute left-3 top-3 rounded-full bg-ivory/80 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-ink/70 backdrop-blur">
            {AVAIL[product.availability]}
          </span>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Link href={`/producto/${product.slug}`} className="font-serif text-lg leading-tight hover:underline">
            {product.name}
          </Link>
          <p className="mt-0.5 text-[0.78rem] text-ash">{product.shortDescription}</p>
        </div>
        <span className="shrink-0 font-sans text-sm tabular-nums">{formatMXN(product.price)}</span>
      </div>

      <div className="mt-3 flex gap-2">
        {product.colors.map((c) => (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
            data-cursor={c.name}
            onClick={() => setColor(c)}
            className={`h-5 w-5 rounded-full ring-1 ring-ink/15 transition-transform ${
              color.name === c.name ? "scale-110 ring-2 ring-ink" : "hover:scale-105"
            }`}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </article>
  );
}
