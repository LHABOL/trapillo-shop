"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { site } from "@/lib/site";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";
import type { Product } from "@/lib/types";

type FloatBag = {
  silhouette: Product["silhouette"];
  weave: Product["weave"];
  color: string;
  shade: string;
  style: React.CSSProperties;
  rot: number;
  /** deriva vertical propia → sensación de profundidad */
  drift: number;
};

const BAGS: FloatBag[] = [
  { silhouette: "tote", weave: "calada", color: "#FF6B4A", shade: "#C4402A", rot: -9, drift: -55, style: { left: "5%", top: "16%", width: "clamp(80px, 12vw, 165px)" } },
  { silhouette: "bucket", weave: "cerrada", color: "#FFC13B", shade: "#C88E1E", rot: 7, drift: -95, style: { right: "7%", top: "12%", width: "clamp(76px, 11vw, 150px)" } },
  { silhouette: "clutch", weave: "espiga", color: "#17C4C4", shade: "#0E8E8E", rot: -5, drift: -28, style: { left: "11%", bottom: "17%", width: "clamp(78px, 11vw, 145px)" } },
  { silhouette: "backpack", weave: "cerrada", color: "#8B46D9", shade: "#5E2C9A", rot: 11, drift: -80, style: { right: "9%", bottom: "13%", width: "clamp(84px, 13vw, 175px)" } },
  { silhouette: "market", weave: "punto-alto", color: "#FF7FB0", shade: "#D2588A", rot: -6, drift: -45, style: { left: "43%", top: "7%", width: "clamp(70px, 10vw, 135px)" } },
  { silhouette: "tote", weave: "cerrada", color: "#E9C21C", shade: "#B8931A", rot: 4, drift: -65, style: { right: "33%", bottom: "7%", width: "clamp(68px, 9vw, 128px)" } },
];

export function MadeToMeasure() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLHeadingElement>(null);
  const bags = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(line.current, { opacity: 1, filter: "none", letterSpacing: "0.02em" });
        gsap.set(bags.current, { opacity: 0.9, filter: "none", rotate: (i: number) => BAGS[i]?.rot ?? 0 });
        return;
      }

      gsap.set(line.current, { opacity: 0, filter: "blur(16px)", letterSpacing: "0.5em", y: 20 });
      gsap.set(bags.current, {
        opacity: 0,
        filter: "blur(14px)",
        y: 40,
        scale: 0.9,
        rotate: (i: number) => BAGS[i]?.rot ?? 0,
      });

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 75%", end: "bottom top", scrub: 1 },
        })
        .to(
          bags.current,
          { opacity: 0.92, filter: "blur(0px)", y: 0, scale: 1, ease: "power2.out", duration: 1, stagger: 0.06 },
          0,
        )
        .to(
          line.current,
          { opacity: 1, filter: "blur(0px)", letterSpacing: "0.02em", y: 0, ease: "power2.out", duration: 1 },
          0.15,
        )
        .to(
          bags.current,
          {
            y: (i: number) => BAGS[i]?.drift ?? -55,
            rotate: (i: number) => (BAGS[i]?.rot ?? 0) + (i % 2 ? 5 : -5),
            ease: "none",
            duration: 1.2,
          },
          0.7,
        )
        .to(bags.current, { opacity: 0, filter: "blur(12px)", ease: "power2.in", duration: 1, stagger: 0.04 }, 1.5)
        .to(line.current, { opacity: 0, filter: "blur(10px)", y: -30, ease: "power2.in", duration: 1 }, 1.6);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative flex min-h-[110svh] items-center justify-center bg-ivory px-6"
    >
      {/* bolsas de colores hechas a mano, detrás del texto */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {BAGS.map((b, i) => (
          <div
            key={i}
            ref={(n) => {
              bags.current[i] = n;
            }}
            className="absolute"
            style={b.style}
          >
            <BagSilhouette
              silhouette={b.silhouette}
              weave={b.weave}
              colorHex={b.color}
              shadeHex={b.shade}
              className="block h-auto w-full drop-shadow-[0_16px_36px_rgba(36,22,64,0.12)]"
            />
          </div>
        ))}
      </div>

      <h2
        ref={line}
        className="relative z-10 font-serif text-[clamp(2rem,7vw,5.5rem)] italic text-walnut"
      >
        {site.manifesto.measure}
      </h2>
    </section>
  );
}
