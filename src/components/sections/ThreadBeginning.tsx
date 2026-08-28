"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";
import { site } from "@/lib/site";

const STAGES = [
  { key: "hilo", label: "Hilo" },
  { key: "patron", label: "Patrón" },
  { key: "tejido", label: "Tejido" },
  { key: "forma", label: "Forma" },
  { key: "bolsa", label: "Bolsa" },
] as const;

function StageVisual({ stage }: { stage: (typeof STAGES)[number]["key"] }) {
  if (stage === "hilo")
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full text-clay">
        <path
          d="M10 100 C 40 40, 70 160, 100 100 S 160 40, 190 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  if (stage === "patron")
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full text-cocoa">
        {Array.from({ length: 10 }).map((_, r) =>
          Array.from({ length: 10 }).map((_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={20 + c * 18}
              cy={20 + r * 18}
              r={(r + c) % 3 === 0 ? 3.4 : 1.6}
              fill="currentColor"
              opacity={(r + c) % 3 === 0 ? 0.9 : 0.4}
            />
          )),
        )}
      </svg>
    );
  if (stage === "tejido")
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full text-cocoa">
        <defs>
          <pattern id="tb-weave" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#CDB89A" />
            <path d="M0 8 H16 M8 0 V16" stroke="#6F4E37" strokeWidth="3" opacity="0.55" />
            <path d="M0 0 L16 16 M16 0 L0 16" stroke="#A9835B" strokeWidth="1" opacity="0.4" />
          </pattern>
        </defs>
        <rect x="16" y="16" width="168" height="168" rx="6" fill="url(#tb-weave)" />
      </svg>
    );
  if (stage === "forma")
    return <BagSilhouette silhouette="tote" outline className="h-full w-full text-cocoa" />;
  return (
    <BagSilhouette
      silhouette="tote"
      weave="calada"
      colorHex="#CDB89A"
      shadeHex="#6F4E37"
      className="h-full w-full"
    />
  );
}

export function ThreadBeginning() {
  const section = useRef<HTMLElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      layers.current.forEach((l, i) => gsap.set(l, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.86 }));
      labels.current.forEach((l, i) => gsap.set(l, { autoAlpha: i === 0 ? 1 : 0.25 }));

      if (reduced) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${STAGES.length * 90}%`,
          scrub: 1,
          pin: true,
        },
      });

      for (let i = 1; i < STAGES.length; i++) {
        tl.to(layers.current[i - 1], { autoAlpha: 0, scale: 1.14, filter: "blur(6px)", ease: "power1.inOut", duration: 1 }, i)
          .fromTo(
            layers.current[i],
            { autoAlpha: 0, scale: 0.86, filter: "blur(6px)" },
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "power1.inOut", duration: 1 },
            i,
          )
          .to(labels.current[i - 1], { autoAlpha: 0.25, ease: "none", duration: 0.4 }, i)
          .to(labels.current[i], { autoAlpha: 1, ease: "none", duration: 0.4 }, i);
      }
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative h-[100svh] w-full overflow-hidden bg-cream">
      <div className="container-editorial flex h-full flex-col justify-center">
        <div className="max-w-xl">
          <span className="eyebrow">Cómo nace</span>
          <h2 className="display mt-4 text-walnut">{site.manifesto.beginning}</h2>
        </div>

        <div className="relative mx-auto mt-6 aspect-square w-[min(70vw,420px)]">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              ref={(n) => {
                layers.current[i] = n;
              }}
              className="absolute inset-0"
            >
              <StageVisual stage={s.key} />
            </div>
          ))}
        </div>

        <ol className="mx-auto mt-8 flex gap-6 font-sans text-[0.62rem] uppercase tracking-[0.28em]">
          {STAGES.map((s, i) => (
            <li key={s.key}>
              <span
                ref={(n) => {
                  labels.current[i] = n;
                }}
                className="text-cocoa"
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
