"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/** Envuelve un elemento y lo hace "magnético" al puntero. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(el, { x, y, duration: 0.6, ease: "power3.out" });
  };
  const reset = () => {
    if (ref.current)
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {children}
    </span>
  );
}
