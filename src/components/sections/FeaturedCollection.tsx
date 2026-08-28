"use client";

import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedCollection() {
  const products = getFeaturedProducts();

  return (
    <section id="coleccion" className="bg-ivory py-24 md:py-36">
      <div className="container-editorial">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Tienda</span>
            <h2 className="display mt-3 text-walnut">Descubre nuestra colección.</h2>
          </div>
          <Link
            href="/coleccion"
            data-cursor="VER TODO"
            className="link-underline text-[0.72rem] uppercase tracking-[0.22em]"
          >
            Ver la colección completa
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
