"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { getFeaturedProducts } from "@/lib/products";
import { formatMXN } from "@/lib/site";
import { ProductImage } from "@/components/products/ProductImage";
import { useIsMobile } from "@/lib/hooks";

const bags = getFeaturedProducts().slice(0, 5);
const backdrop = getFeaturedProducts().slice(0, 6);

// posición de entrada por índice (§9-§10): izq / der / centro / fondo, alternando
const ENTRIES = [
  { x: -60, z: -220, ry: 24 },
  { x: 60, z: -260, ry: -24 },
  { x: 0, z: -380, ry: 0 },
  { x: -52, z: -300, ry: 18 },
  { x: 58, z: -240, ry: -20 },
];

export function FloatingBags() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const bg = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    // el desfile corre igual en móvil; solo se ajusta la magnitud del 3D
    const k = isMobile ? 0.62 : 1;

    let idles: ReturnType<typeof gsap.to>[] = [];
    let onMove: ((ev: PointerEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      if (reduced) {
        cards.current.forEach((c) => gsap.set(c, { autoAlpha: 1, xPercent: 0, y: 0, rotateY: 0, scale: 1, z: 0 }));
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${bags.length * 82}%`,
          scrub: 0.5,
          pin: true,
        },
      });

      cards.current.forEach((c, i) => {
        const e = ENTRIES[i];
        tl.fromTo(
          c,
          { autoAlpha: 0, xPercent: e.x * k, z: e.z * k, rotateY: e.ry * k, scale: 0.7, filter: "blur(8px)" },
          { autoAlpha: 1, xPercent: 0, z: 40 * k, rotateY: 0, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 },
          i * 0.9,
        ).to(
          c,
          { autoAlpha: 0, xPercent: -e.x * k, z: -420 * k, rotateY: -e.ry * k, scale: 0.72, filter: "blur(8px)", ease: "power2.in", duration: 1 },
          i * 0.9 + 1,
        );
      });

      // fondo (capa "bolsas siendo tejidas") con parallax propio
      gsap.to(bg.current, {
        yPercent: -22,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });

      // vaivén contínuo
      idles = cards.current
        .filter((c): c is HTMLDivElement => !!c)
        .map((c) =>
          gsap.to(c, { y: "+=12", rotateZ: 1.1, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        );

      // tilt de puntero solo con ratón
      if (fine) {
        onMove = (ev: PointerEvent) => {
          const rx = (ev.clientY / window.innerHeight - 0.5) * -6;
          const ry = (ev.clientX / window.innerWidth - 0.5) * 10;
          gsap.to(stage.current, { rotateX: rx, rotateY: ry, duration: 0.8, ease: "power2.out" });
        };
        window.addEventListener("pointermove", onMove);
      }
    }, el);

    return () => {
      idles.forEach((t) => t.kill());
      if (onMove) window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section ref={section} className="relative min-h-[100svh] overflow-hidden bg-cream">
      {/* fondo: capa de piezas desenfocadas (§11) */}
      <div
        ref={bg}
        className="pointer-events-none absolute inset-x-0 -top-[12%] h-[135%] opacity-40"
        style={{ filter: "blur(9px) saturate(0.95)" }}
        aria-hidden
      >
        {backdrop.map((b, i) => (
          <div
            key={b.id}
            className="absolute h-[34vmin] w-[26vmin] overflow-hidden rounded-sm"
            style={{
              left: `${8 + (i % 3) * 34}%`,
              top: `${6 + Math.floor(i / 3) * 46}%`,
              transform: `rotate(${i % 2 ? 4 : -3}deg)`,
            }}
          >
            <ProductImage product={b} className="object-cover" sizes="30vw" />
          </div>
        ))}
      </div>

      <div className="container-editorial relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-4 md:gap-0">
        <div className="relative z-20 w-full max-w-md text-center md:pointer-events-none md:absolute md:left-[max(1.25rem,5vw)] md:top-24 md:text-left">
          <span className="eyebrow">La colección</span>
          <h2 className="display mt-2 text-walnut md:mt-3">El desfile</h2>
        </div>

        <div
          className="relative mx-auto h-[58vh] w-full max-w-5xl overflow-hidden md:h-[70vh] md:overflow-visible"
          style={{ perspective: "1200px" }}
        >
          <div ref={stage} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {bags.map((b, i) => (
              <div
                key={b.id}
                ref={(n) => {
                  cards.current[i] = n;
                }}
                data-cursor="VER PRODUCTO"
                className="absolute left-1/2 top-1/2 w-[min(60vw,300px)] -translate-x-1/2 -translate-y-1/2 md:w-[min(72vw,320px)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Link href={`/producto/${b.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ivory/70 shadow-[0_30px_80px_-30px_rgba(36,22,64,0.45)] ring-1 ring-ink/10 transition-transform duration-500 group-hover:-translate-y-1">
                    <ProductImage
                      product={b}
                      className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 60vw, 320px"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between font-sans text-[0.82rem] md:mt-4 md:text-sm">
                    <span className="font-serif text-[0.95rem] md:text-base">{b.name}</span>
                    <span className="tabular-nums text-ash">{formatMXN(b.price)}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
