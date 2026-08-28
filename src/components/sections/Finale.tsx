"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { Magnetic } from "@/components/ui/Magnetic";

export function Finale() {
  const section = useRef<HTMLElement>(null);
  const connector = useRef<SVGPathElement>(null);
  const mark = useRef<SVGSVGElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const markPath = mark.current?.querySelector("text");
      if (reduced) {
        gsap.set([connector.current, markPath ?? mark.current, copy.current], { autoAlpha: 1 });
        return;
      }

      const cLen = connector.current!.getTotalLength();
      gsap.set(connector.current, { strokeDasharray: cLen, strokeDashoffset: cLen });
      gsap.set(mark.current, { autoAlpha: 0, y: 16, filter: "blur(10px)" });
      gsap.set(copy.current, { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom bottom", scrub: 1 },
        })
        .to(connector.current, { strokeDashoffset: 0, ease: "none", duration: 2 })
        .to(mark.current, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1 }, "-=0.6")
        .to(connector.current, { autoAlpha: 0.25, duration: 0.6 }, "<")
        .to(copy.current, { autoAlpha: 1, y: 0, duration: 1 }, "-=0.3");
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-ink py-28 text-ivory md:py-40">
      <div className="container-editorial flex flex-col items-center text-center">
        <svg viewBox="0 0 600 220" className="w-[min(88vw,620px)] text-clay" aria-hidden>
          <path
            ref={connector}
            d="M40 170 C 120 60, 180 60, 240 150 S 360 60, 430 120 S 540 170, 560 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {[60, 180, 300, 420, 540].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 150 : 96} r="4" fill="currentColor" opacity="0.7" />
          ))}
        </svg>

        <Wordmark ref={mark} mode="draw" className="mt-2 w-[min(72vw,460px)] text-ivory" />

        <div ref={copy} className="mt-12">
          <p className="font-serif text-[clamp(1.6rem,4.5vw,2.8rem)] italic">{site.manifesto.finaleA}</p>
          <p className="mt-2 font-serif text-[clamp(1.6rem,4.5vw,2.8rem)] text-ivory/70">{site.manifesto.finaleB}</p>
          <Magnetic>
            <Link
              href="/coleccion"
              data-cursor="EXPLORAR"
              className="mt-9 inline-block border border-ivory/40 px-10 py-4 text-[0.72rem] uppercase tracking-[0.3em] transition-colors hover:bg-ivory hover:text-ink"
            >
              Explorar colección
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
