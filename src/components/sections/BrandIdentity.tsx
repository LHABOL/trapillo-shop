"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";

export function BrandIdentity() {
  const section = useRef<HTMLElement>(null);
  const a = useRef<HTMLHeadingElement>(null);
  const b = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    registerGsap();
    const el = section.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=180%", scrub: 1, pin: true },
      })
        .fromTo(a.current, { scale: 0.82, autoAlpha: 0.15, y: 40 }, { scale: 1, autoAlpha: 1, y: 0, ease: "power2.out", duration: 1 })
        .to(a.current, { scale: 1.35, autoAlpha: 0, y: -60, filter: "blur(8px)", ease: "power2.in", duration: 1 })
        .fromTo(
          b.current,
          { scale: 0.82, autoAlpha: 0, y: 60, filter: "blur(8px)" },
          { scale: 1, autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 1 },
          "<0.15",
        )
        .fromTo(el, { backgroundColor: "#EDE4D3" }, { backgroundColor: "#1C1712", ease: "none", duration: 2 }, 0);
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-cream px-6"
    >
      <h2
        ref={a}
        className="absolute max-w-[16ch] text-center font-serif text-[clamp(2.4rem,10vw,8rem)] leading-[0.95] text-walnut"
      >
        {site.manifesto.identityA}
      </h2>
      <h2
        ref={b}
        className="absolute max-w-[16ch] text-center font-serif italic text-[clamp(2.4rem,10vw,8rem)] leading-[0.95] text-ivory opacity-0"
      >
        {site.manifesto.identityB}
      </h2>
    </section>
  );
}
