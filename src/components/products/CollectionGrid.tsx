"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { ProductCategory } from "@/lib/types";

const FILTERS: { label: string; value: ProductCategory | "all" }[] = [
  { label: "Todo", value: "all" },
  { label: "Totes", value: "tote" },
  { label: "Cestos", value: "cesto" },
  { label: "Clutch", value: "clutch" },
  { label: "Mochilas", value: "mochila" },
  { label: "Playa", value: "playa" },
];

export function CollectionGrid() {
  const params = useSearchParams();
  const initial = (params.get("cat") as ProductCategory | null) ?? "all";
  const [cat, setCat] = useState<ProductCategory | "all">(initial);

  const products = useMemo(() => {
    const all = getAllProducts();
    return cat === "all" ? all : all.filter((p) => p.category === cat);
  }, [cat]);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-2 border-y border-ink/10 py-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setCat(f.value)}
            data-cursor=""
            className={`rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition-colors ${
              cat === f.value ? "bg-ink text-ivory" : "text-ink/60 hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.06}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-20 text-center text-ash">No hay piezas en esta categoría todavía.</p>
      )}
    </div>
  );
}
