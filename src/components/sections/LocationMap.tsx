"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";

export function LocationMap() {
  const section = useRef<HTMLElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(map.current, { filter: "blur(0px)", scale: 1, autoAlpha: 1 });
        return;
      }
      gsap.fromTo(
        map.current,
        { filter: "blur(22px)", scale: 1.15, autoAlpha: 0.4 },
        {
          filter: "blur(0px)",
          scale: 1,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", end: "center center", scrub: 1 },
        },
      );
      gsap.to(info.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="container-editorial grid gap-12 md:grid-cols-2 md:items-center">
        <div ref={info}>
          <span className="eyebrow">Ubicación</span>
          <h2 className="display mt-4 text-walnut">Visítanos.</h2>
          <address className="mt-6 not-italic text-ash">
            {site.contact.location.line1}
            <br />
            {site.contact.location.line2}
          </address>
          <p className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-ash">
            {site.contact.hours}
          </p>
          <a
            href={site.contact.location.mapsHref}
            target="_blank"
            rel="noreferrer"
            data-cursor="CÓMO LLEGAR"
            className="mt-6 inline-block border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.22em]"
          >
            Cómo llegar
          </a>
        </div>

        <div
          ref={map}
          className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-ink/10"
        >
          <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Mapa estilizado de la ubicación">
            <rect width="400" height="300" fill="#FFE9D6" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="0" x2="400" y1={i * 38 + 10} y2={i * 38 + 4} stroke="#FFC44D" strokeWidth="6" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 36 + 8} x2={i * 36 + 2} y1="0" y2="300" stroke="#FFC44D" strokeWidth="5" />
            ))}
            <path d="M-10 210 C 120 190, 260 250, 420 200" stroke="#17C4C4" strokeWidth="14" fill="none" opacity="0.65" />
            <path d="M150 -10 C 170 120, 120 200, 200 320" stroke="#17C4C4" strokeWidth="12" fill="none" opacity="0.5" />
            <circle cx="205" cy="150" r="30" fill="#FF6B4A" opacity="0.18" />
            <circle cx="205" cy="150" r="7" fill="#FF6B4A" />
            <path d="M205 150 L205 120" stroke="#241640" strokeWidth="3" />
          </svg>
          <div className="pointer-events-none absolute inset-0 vignette" />
        </div>
      </div>
    </section>
  );
}
