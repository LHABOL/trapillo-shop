"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

type ScrollCtx = {
  lenis: Lenis | null;
  start: () => void;
  stop: () => void;
  scrollTo: (target: number | string | HTMLElement, opts?: Record<string, unknown>) => void;
};

const Ctx = createContext<ScrollCtx>({
  lenis: null,
  start: () => {},
  stop: () => {},
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(Ctx);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();

    if (reduced) {
      // Sin smooth scroll: ScrollTrigger sigue funcionando con scroll nativo.
      ScrollTrigger.refresh();
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const lenis = new Lenis({
      lerp: isMobile ? 0.14 : 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      syncTouch: false,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    setReady(true);

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const api = useMemo<ScrollCtx>(
    () => ({
      get lenis() {
        return lenisRef.current;
      },
      start: () => {
        lenisRef.current?.start();
        document.documentElement.classList.remove("scroll-locked", "lenis-stopped");
      },
      stop: () => {
        if (lenisRef.current) lenisRef.current.stop();
        else document.documentElement.classList.add("scroll-locked");
      },
      scrollTo: (target, opts) => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target as never, { duration: 1.6, ...opts });
        } else if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      },
    }),
    [],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
