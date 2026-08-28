"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { MacroTexture } from "@/components/visuals/MacroTexture";
import { WeaveShader } from "@/components/visuals/WeaveShader";

const STEPS = [
  {
    kind: "hilo" as const,
    title: "El hilo",
    body: "Trapillo de algodón reciclado, hilado a partir de retales de la industria textil. Grueso, mate, con la irregularidad de lo que fue otra cosa antes.",
  },
  {
    kind: "punto" as const,
    title: "El punto",
    body: "Cada vuelta se cuenta. La tensión de la mano define si la pieza cae o se sostiene. No hay máquina que iguale ese criterio.",
  },
  {
    kind: "remate" as const,
    title: "El remate",
    body: "Asas trenzadas a tres cabos, costuras con hilo encerado, bordes en punto festón. El final es donde se nota el oficio.",
  },
];

export function Craft() {
  const section = useRef<HTMLElement>(null);
  const visuals = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const progTrigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    if (reduced) return () => progTrigger.kill();

    const ctx = gsap.context(() => {
      visuals.current.forEach((v, i) => {
        if (!v) return;
        gsap.set(v, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.18 });
        ScrollTrigger.create({
          trigger: el.querySelectorAll("[data-craft-step]")[i] as Element,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (self.isActive) {
              visuals.current.forEach((o, j) =>
                gsap.to(o, {
                  autoAlpha: j === i ? 1 : 0,
                  scale: j === i ? 1 : 1.18,
                  duration: 1.1,
                  ease: "power2.out",
                }),
              );
            }
          },
        });
      });

      // zoom cinematográfico continuo sobre la capa activa
      gsap.to(el.querySelector("[data-craft-stage]"), {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => {
      progTrigger.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} className="relative bg-walnut text-ivory">
      <WeaveShader
        progressRef={progress}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-walnut/70 via-walnut/40 to-walnut/80" />

      <div className="container-editorial relative grid md:grid-cols-2">
        {/* Visual fijo que se funde entre etapas — igual en móvil y escritorio */}
        <div className="pointer-events-none col-start-1 row-start-1 z-20 md:z-0">
          <div className="sticky top-14 flex h-[42vh] items-center bg-walnut md:top-0 md:h-[100svh] md:bg-transparent md:py-0">
            <div
              data-craft-stage
              className="relative aspect-[16/10] w-full overflow-hidden rounded-sm ring-1 ring-ivory/15 md:aspect-[4/5]"
            >
              {STEPS.map((s, i) => (
                <div
                  key={s.kind}
                  ref={(n) => {
                    visuals.current[i] = n;
                  }}
                  className="absolute inset-0"
                >
                  <MacroTexture kind={s.kind} className="h-full w-full" />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 vignette" />
            </div>
          </div>
        </div>

        {/* Texto que corre por detrás del visual en móvil */}
        <div className="relative z-10 col-start-1 row-start-1 pt-[46vh] md:col-start-2 md:row-start-1 md:pt-0 md:pl-14">
          {STEPS.map((s, i) => (
            <div
              key={s.kind}
              data-craft-step
              className="flex min-h-[64svh] flex-col justify-center py-14 md:min-h-[100svh] md:py-16"
            >
              <span className="eyebrow text-ivory/50">0{i + 1} · Artesanía</span>
              <h3 className="mt-3 font-serif text-[clamp(1.9rem,5vw,3.4rem)] text-ivory">{s.title}</h3>
              <p className="mt-5 max-w-md text-ivory/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
