"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { registerGsap, gsap } from "@/lib/gsap";
import { site } from "@/lib/site";

/**
 * Transición de entrada entre rutas (§26): una cortina con el hilo que se
 * retira hacia arriba. `template.tsx` se re-monta en cada navegación.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();
    const el = overlay.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // En la home el LoadingScreen ya hace de intro: saltamos la cortina.
    if (pathname === "/" || reduced) {
      gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
      return;
    }

    const thread = threadRef.current;
    const len = thread?.getTotalLength() ?? 0;
    if (thread) gsap.set(thread, { strokeDasharray: len, strokeDashoffset: len });

    const tl = gsap.timeline();
    tl.set(el, { autoAlpha: 1, yPercent: 0, pointerEvents: "auto" })
      .to(thread, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 0)
      .to(el, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, 0.35)
      .set(el, { autoAlpha: 0, pointerEvents: "none" });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={overlay}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-ivory"
        style={{ opacity: 0 }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="0 0 200 40" className="w-40 text-clay">
            <path
              ref={threadRef}
              d="M4 20 C 30 4, 60 36, 90 20 S 150 4, 196 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-serif text-sm tracking-[0.3em] text-ink/70">{site.name}</span>
        </div>
      </div>
      {children}
    </>
  );
}
