"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAllProducts } from "@/lib/products";
import { formatMXN } from "@/lib/site";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

const SIZES: Product["attributes"]["size"][] = ["mini", "media", "grande"];
const STYLES: Product["attributes"]["style"][] = ["minimal", "clasica", "statement"];
const OCCASIONS: Product["attributes"]["occasion"][] = ["diario", "trabajo", "playa", "noche"];
const COLORS = [
  { name: "Marfil", hex: "#EDE4D3", shade: "#CDB89A" },
  { name: "Arena", hex: "#CDB89A", shade: "#A9835B" },
  { name: "Arcilla", hex: "#A9835B", shade: "#6F4E37" },
  { name: "Cacao", hex: "#6F4E37", shade: "#3E2C20" },
];

const all = getAllProducts();

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor=""
      className={`rounded-full border px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] transition-colors ${
        active
          ? "border-ink bg-ink text-ivory"
          : "border-ink/25 text-ink/70 hover:border-ink/60"
      }`}
    >
      {children}
    </button>
  );
}

export function Finder() {
  const [size, setSize] = useState<Product["attributes"]["size"]>("media");
  const [style, setStyle] = useState<Product["attributes"]["style"]>("minimal");
  const [occasion, setOccasion] = useState<Product["attributes"]["occasion"]>("diario");
  const [color, setColor] = useState(COLORS[1]);

  const match = useMemo(() => {
    const scored = all
      .map((p) => {
        let s = 0;
        if (p.attributes.size === size) s += 3;
        if (p.attributes.style === style) s += 2;
        if (p.attributes.occasion === occasion) s += 2;
        return { p, s };
      })
      .sort((a, b) => b.s - a.s);
    return scored[0].p;
  }, [size, style, occasion]);

  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="container-editorial grid gap-14 md:grid-cols-[1fr_1.1fr] md:items-center">
        <Reveal>
          <span className="eyebrow">Configurador</span>
          <h2 className="display mt-4 text-walnut">Encuentra la que habla de ti.</h2>

          <div className="mt-10 space-y-7">
            <div>
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-ash">Tamaño</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <Chip key={s} active={size === s} onClick={() => setSize(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-ash">Estilo</p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <Chip key={s} active={style === s} onClick={() => setStyle(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-ash">Ocasión</p>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((s) => (
                  <Chip key={s} active={occasion === s} onClick={() => setOccasion(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-ash">Color</p>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    data-cursor={c.name}
                    className={`h-8 w-8 rounded-full ring-1 ring-ink/15 transition-transform ${
                      color.name === c.name ? "scale-110 ring-2 ring-ink" : "hover:scale-105"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="relative">
          <div className="mx-auto aspect-square w-[min(80vw,460px)] rounded-sm bg-linen/50 p-8 ring-1 ring-ink/10">
            <BagSilhouette
              key={match.id + color.name}
              silhouette={match.silhouette}
              weave={match.weave}
              colorHex={color.hex}
              shadeHex={color.shade}
              className="h-full w-full transition-opacity duration-500"
            />
          </div>
          <div className="mx-auto mt-6 w-[min(80vw,460px)] text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-ash">Te proponemos</p>
            <h3 className="mt-1 font-serif text-2xl">{match.name}</h3>
            <p className="mt-1 text-sm tabular-nums text-ash">
              {formatMXN(match.price)} · {color.name}
            </p>
            <Link
              href={`/producto/${match.slug}`}
              data-cursor="VER PRODUCTO"
              className="mt-4 inline-block border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.22em]"
            >
              Ver este modelo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
