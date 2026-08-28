"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { registerGsap, gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  start?: string;
};

/** Reveal cinematográfico ligado a scroll: y + opacity + blur. */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 28,
  blur = true,
  start = "top 82%",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, toggleActions: "play none none reverse" },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, blur, start]);

  return createElement(
    as,
    { ref, className, style: { willChange: "transform, opacity" } },
    children,
  );
}
