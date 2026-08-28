"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string): boolean {
  // Valor correcto ya en el primer render del cliente → evita el "flash"
  // desktop→móvil que descoloca los pines de ScrollTrigger.
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** true en pantallas < 768px */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/** Heurística de dispositivo con pocos recursos → baja densidad de efectos. */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const mem = nav.deviceMemory ?? 8;
    setLow(cores <= 4 || mem <= 4);
  }, []);
  return low;
}

/** Posición del puntero normalizada a [-1, 1] con suavizado exponencial. */
export function usePointer(smoothing = 0.08) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      cx += (tx - cx) * smoothing;
      cy += (ty - cy) * smoothing;
      setPos({ x: cx, y: cy });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [smoothing]);
  return pos;
}
