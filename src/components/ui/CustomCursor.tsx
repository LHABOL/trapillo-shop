"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    if (fine && wide) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;

    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.15, ease: "power3" });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.15, ease: "power3" });
    const xRing = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const yRing = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const enter = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest ? (t.closest("[data-cursor]") as HTMLElement | null) : null;
      if (!el) return;
      const text = el.dataset.cursor || "";
      if (label.current) label.current.textContent = text;
      gsap.to(ring.current, {
        scale: text ? 3.6 : 2.2,
        borderColor: "rgba(28,23,18,0)",
        backgroundColor: "rgba(169,131,91,0.94)",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(dot.current, { scale: 0, duration: 0.3 });
      gsap.to(label.current, { autoAlpha: 1, duration: 0.3, delay: 0.05 });
    };
    const leave = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest ? t.closest("[data-cursor]") : null;
      if (!el) return;
      gsap.to(ring.current, {
        scale: 1,
        borderColor: "rgba(28,23,18,0.55)",
        backgroundColor: "rgba(28,23,18,0)",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(dot.current, { scale: 1, duration: 0.3 });
      gsap.to(label.current, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", enter);
    document.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", enter);
      document.removeEventListener("pointerout", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden lg:block" aria-hidden>
      <div
        ref={ring}
        className="absolute left-0 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/55"
      >
        <span
          ref={label}
          className="text-[9px] font-sans font-medium uppercase tracking-[0.2em] text-ivory opacity-0"
        />
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
      />
    </div>
  );
}
