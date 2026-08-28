import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { MacroTexture } from "@/components/visuals/MacroTexture";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Historia",
  description: "Del hilo a tu bolsa: cómo nace una pieza TRAPILLO.",
};

const CHAPTERS = [
  {
    n: "01",
    title: "Todo comienza con un hilo",
    body: "Compramos retales a talleres textiles de la Ciudad de México: sobrantes de rollos, tiras de corte, algodón que iba a la basura. Lo lavamos, lo hilamos en trapillo y lo ovillamos a mano. Cada ovillo pesa distinto porque cada retal era otra cosa.",
    kind: "hilo" as const,
  },
  {
    n: "02",
    title: "El patrón",
    body: "Antes de tejer dibujamos. Cuántos puntos de base, dónde crece la pieza, cómo cae el asa. Un patrón bien hecho es la diferencia entre una bolsa que se deforma y una que dura años.",
    kind: "punto" as const,
  },
  {
    n: "03",
    title: "La mano",
    body: "Tejen tres personas. Entre 12 y 20 horas por pieza, según el modelo. No hay máquina: la tensión, el ritmo y el criterio para corregir un punto flojo son humanos.",
    kind: "remate" as const,
  },
];

export default function HistoriaPage() {
  return (
    <PageShell
      eyebrow="Nuestra historia"
      title="Del hilo a tu bolsa."
      intro="No inventamos nada. Solo hacemos las cosas despacio, con material que ya existía."
    >
      <div className="mt-20 space-y-28">
        {CHAPTERS.map((c, i) => (
          <Reveal
            key={c.n}
            as="section"
            className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-ink/10">
              <MacroTexture kind={c.kind} className="h-full w-full" />
            </div>
            <div>
              <span className="eyebrow">{c.n}</span>
              <h2 className="mt-3 font-serif text-[clamp(1.8rem,4vw,3rem)] text-walnut">{c.title}</h2>
              <p className="mt-5 max-w-md text-ash">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-32 border-t border-ink/10 pt-16 text-center">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-5">
          {(["tote", "bucket", "clutch", "backpack", "market"] as const).map((s) => (
            <BagSilhouette key={s} silhouette={s} colorHex="#CDB89A" shadeHex="#6F4E37" className="h-24 w-full" />
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-xl font-serif text-2xl italic text-walnut">
          {site.manifesto.finaleA} {site.manifesto.finaleB}
        </p>
        <Link
          href="/coleccion"
          data-cursor="EXPLORAR"
          className="mt-8 inline-block bg-ink px-10 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-walnut"
        >
          Ver la colección
        </Link>
      </Reveal>
    </PageShell>
  );
}
