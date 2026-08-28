"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useEffect } from "react";
import type { Product } from "@/lib/types";
import { formatMXN, site } from "@/lib/site";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";
import { ProductStage } from "@/components/visuals/ProductStage";
import { AddToCartButton } from "@/components/products/AddToCartButton";

const AVAIL: Record<Product["availability"], string> = {
  "in-stock": "Disponible · envío en 3–5 días",
  "made-to-order": "Por encargo · 2–3 semanas",
  "sold-out": "Agotado",
};

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [color, setColor] = useState(product.colors[Math.min(1, product.colors.length - 1)]);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !stage.current) return;
    gsap.fromTo(
      stage.current,
      { autoAlpha: 0, y: 30, filter: "blur(12px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
    );
  }, []);

  return (
    <main className="min-h-screen bg-ivory pb-28 pt-24 md:pt-28">
      <div className="container-editorial">
        <nav className="mb-10 text-[0.68rem] uppercase tracking-[0.2em] text-ash">
          <Link href="/coleccion" className="hover:text-ink">
            Colección
          </Link>{" "}
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-14 md:grid-cols-2">
          <div
            ref={stage}
            className="relative aspect-square self-start overflow-hidden rounded-sm bg-linen/50 ring-1 ring-ink/10 md:sticky md:top-28"
          >
            <ProductStage
              silhouette={product.silhouette}
              weave={product.weave}
              colorHex={color.hex}
              shadeHex={color.shade}
              className="h-full w-full [&_canvas]:!touch-none"
            />
            <div className="pointer-events-none absolute inset-0 vignette rounded-sm" />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[0.58rem] uppercase tracking-[0.28em] text-ash">
              Arrastra para girar
            </span>
          </div>

          <div>
            <span className="eyebrow">{product.category}</span>
            <h1 className="mt-3 font-serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[1] text-walnut">
              {product.name}
            </h1>
            <p className="mt-4 text-xl tabular-nums">{formatMXN(product.price)}</p>
            <p className="mt-6 max-w-md text-ash">{product.description}</p>

            <div className="mt-8">
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-ash">
                Color · {color.name}
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    data-cursor={c.name}
                    className={`h-9 w-9 rounded-full ring-1 ring-ink/15 transition-transform ${
                      color.name === c.name ? "scale-110 ring-2 ring-ink" : "hover:scale-105"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton product={product} colorName={color.name} openDrawer />
              <Link
                href="/carrito"
                data-cursor="IR AL PAGO"
                className="inline-flex items-center border border-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.26em] transition-colors hover:bg-ink hover:text-ivory"
              >
                Comprar ahora
              </Link>
            </div>

            <p className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-clay">
              {AVAIL[product.availability]}
            </p>

            <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="flex justify-between py-3">
                <dt className="text-ash">Medidas</dt>
                <dd>
                  {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth}{" "}
                  {product.dimensions.unit}
                </dd>
              </div>
              <div className="flex justify-between gap-8 py-3">
                <dt className="text-ash">Materiales</dt>
                <dd className="text-right">{product.materials.join(" · ")}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-ash">Tejido</dt>
                <dd className="capitalize">{product.weave}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-ash">Envío</dt>
                <dd>{site.shipping.copy}</dd>
              </div>
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-28">
            <h2 className="font-serif text-2xl text-walnut">Del mismo hilo</h2>
            <div className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/producto/${r.slug}`} data-cursor="VER" className="group">
                  <div className="aspect-square rounded-sm bg-linen/50 p-6 ring-1 ring-ink/10">
                    <BagSilhouette
                      silhouette={r.silhouette}
                      weave={r.weave}
                      colorHex={r.colors[1].hex}
                      shadeHex={r.colors[1].shade}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 font-serif">{r.name}</p>
                  <p className="text-sm text-ash tabular-nums">{formatMXN(r.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
