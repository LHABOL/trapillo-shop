"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * El hilo conductor (§2): un único trazo fijo al viewport cuyo avance =
 * progreso de scroll. Cose toda la experiencia de arriba a abajo.
 */
export function ConductorThread() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    registerGsap();
    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        gsap.set(path, { strokeDashoffset: len * (1 - self.progress) });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        ref={pathRef}
        d="M 8 -2
           C 20 12, -6 22, 12 34
           S 30 52, 14 64
           S -4 82, 18 96
           S 40 108, 30 120"
        fill="none"
        stroke="#A9835B"
        strokeWidth="0.22"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.6"
      />
    </svg>
  );
}
