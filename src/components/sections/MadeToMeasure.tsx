"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";

export function MadeToMeasure() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(line.current, { opacity: 1, filter: "none", letterSpacing: "0.02em" });
        return;
      }
      gsap.set(line.current, { opacity: 0, filter: "blur(16px)", letterSpacing: "0.5em", y: 20 });
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 75%", end: "bottom top", scrub: 1 },
        })
        .to(line.current, { opacity: 1, filter: "blur(0px)", letterSpacing: "0.02em", y: 0, ease: "power2.out", duration: 1 })
        .to(line.current, { opacity: 0, filter: "blur(10px)", y: -30, ease: "power2.in", duration: 1 });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="flex min-h-[110svh] items-center justify-center bg-ivory px-6"
    >
      <h2
        ref={line}
        className="font-serif text-[clamp(2rem,7vw,5.5rem)] italic text-walnut"
      >
        {site.manifesto.measure}
      </h2>
    </section>
  );
}
