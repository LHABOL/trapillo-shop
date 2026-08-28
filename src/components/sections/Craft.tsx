"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { MacroTexture } from "@/components/visuals/MacroTexture";
import { WeaveShader } from "@/components/visuals/WeaveShader";
import { useIsMobile } from "@/lib/hooks";

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
  const mVisuals = useRef<(HTMLDivElement | null)[]>([]);
  const mCaptions = useRef<(HTMLDivElement | null)[]>([]);
  const dVisuals = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const isMobile = useIsMobile();

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

    if (reduced) {
      [...mVisuals.current, ...dVisuals.current].forEach((v, i) => v && gsap.set(v, { autoAlpha: i % STEPS.length === 0 ? 1 : 0 }));
      mCaptions.current.forEach((c, i) => c && gsap.set(c, { autoAlpha: i === 0 ? 1 : 0 }));
      return () => progTrigger.kill();
    }

    const ctx = gsap.context(() => {
      if (isMobile) {
        // Móvil: panel anclado, una etapa a la vez, funde con el scrub. Nada encimado.
        const vis = mVisuals.current;
        const cap = mCaptions.current;
        vis.forEach((v, i) => v && gsap.set(v, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.08 }));
        cap.forEach((c, i) => c && gsap.set(c, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 18 }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${STEPS.length * 78}%`,
            scrub: 0.5,
            pin: true,
          },
        });

        for (let i = 1; i < STEPS.length; i++) {
          tl.to(vis[i - 1], { autoAlpha: 0, scale: 1.1, duration: 1, ease: "power1.inOut" }, i)
            .fromTo(vis[i], { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 1, ease: "power1.inOut" }, i)
            .to(cap[i - 1], { autoAlpha: 0, y: -18, duration: 0.5, ease: "power1.in" }, i)
            .fromTo(cap[i], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power1.out" }, i + 0.35);
        }

        gsap.to(el.querySelector("[data-craft-stage-m]"), {
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: `+=${STEPS.length * 78}%`, scrub: 0.5 },
        });
        return;
      }

      // Escritorio: visual fijo lateral + texto que corre.
      const vis = dVisuals.current;
      vis.forEach((v, i) => {
        if (!v) return;
        gsap.set(v, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.18 });
        ScrollTrigger.create({
          trigger: el.querySelectorAll("[data-craft-step]")[i] as Element,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (self.isActive) {
              vis.forEach((o, j) =>
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

      gsap.to(el.querySelector("[data-craft-stage-d]"), {
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true },
      });
    }, el);

    return () => {
      progTrigger.kill();
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section ref={section} className="relative bg-walnut text-ivory">
      <WeaveShader
        progressRef={progress}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-walnut/70 via-walnut/40 to-walnut/80" />

      {/* MÓVIL — panel anclado */}
      <div className="relative flex h-[100svh] flex-col items-center justify-center gap-6 px-6 md:hidden">
        <span className="eyebrow text-ivory/50">Artesanía</span>
        <div
          data-craft-stage-m
          className="relative aspect-[4/5] w-[min(62vw,280px)] overflow-hidden rounded-sm ring-1 ring-ivory/15"
        >
          {STEPS.map((s, i) => (
            <div
              key={s.kind}
              ref={(n) => {
                mVisuals.current[i] = n;
              }}
              className="absolute inset-0"
            >
              <MacroTexture kind={s.kind} className="h-full w-full" />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 vignette" />
        </div>
        <div className="relative h-48 w-full max-w-sm text-center">
          {STEPS.map((s, i) => (
            <div
              key={s.kind}
              ref={(n) => {
                mCaptions.current[i] = n;
              }}
              className="absolute inset-x-0 top-0"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/40">0{i + 1}</span>
              <h3 className="mt-1.5 font-serif text-[clamp(1.7rem,6.5vw,2.3rem)] text-ivory">{s.title}</h3>
              <p className="mx-auto mt-2.5 max-w-[17rem] text-[0.8rem] leading-relaxed text-ivory/70">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ESCRITORIO — visual fijo + texto que corre */}
      <div className="container-editorial relative hidden grid-cols-2 md:grid">
        <div className="pointer-events-none">
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div
              data-craft-stage-d
              className="relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1 ring-ivory/15"
            >
              {STEPS.map((s, i) => (
                <div
                  key={s.kind}
                  ref={(n) => {
                    dVisuals.current[i] = n;
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

        <div className="relative pl-14">
          {STEPS.map((s, i) => (
            <div
              key={s.kind}
              data-craft-step
              className="flex min-h-[100svh] flex-col justify-center py-16"
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
