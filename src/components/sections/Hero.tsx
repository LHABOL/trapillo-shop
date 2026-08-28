"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { HeroCanvas } from "@/components/sections/HeroCanvas";
import { site } from "@/lib/site";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.current,
        { opacity: 0, y: 30, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, delay: reduced ? 0 : 1.1, ease: "power3.out" },
      );

      if (reduced) return;

      gsap.to(hint.current, { opacity: 0.35, y: 8, repeat: -1, yoyo: true, duration: 1.4, ease: "sine.inOut" });

      // "la cámara se desplaza siguiendo el hilo"
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=120%",
          scrub: 0.5,
          pin: true,
        },
      })
        .to(stage.current, { yPercent: -14, scale: 1.08, filter: "blur(2px)", ease: "none" }, 0)
        .to(content.current, { yPercent: -60, opacity: 0, ease: "none" }, 0)
        .to(hint.current, { opacity: 0, ease: "none" }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative h-[100svh] w-full overflow-hidden bg-ivory">
      <div ref={stage} className="absolute inset-0">
        <HeroCanvas className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 vignette" />

      <div
        ref={content}
        className="absolute inset-x-0 top-[18%] flex flex-col items-center px-6 text-center"
      >
        <span className="eyebrow mb-5">{site.tagline}</span>
        <h1 className="display max-w-[14ch] text-balance text-ink">
          Del hilo <span className="italic text-clay">a tu bolsa</span>
        </h1>
      </div>

      <div
        ref={hint}
        className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-ash"
      >
        <span className="font-sans text-[0.58rem] uppercase tracking-[0.35em]">Desliza</span>
        <span className="block h-10 w-px bg-ash/60" />
      </div>
    </section>
  );
}
