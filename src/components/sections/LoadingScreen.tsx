"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { Wordmark } from "@/components/ui/Wordmark";

export function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const enterRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    registerGsap();
    // El overlay fijo (z-100) ya bloquea la interacción durante la carga;
    // no tocamos overflow del <html> para no confundir a Lenis al inicializar.
    window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = pathRef.current;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      window.scrollTo(0, 0);
      // Señal para que la escena del hero arranque la caída ahora que se ve.
      window.dispatchEvent(new Event("trapillo:enter"));
      setGone(true);
      onDoneRef.current?.();
    };

    if (reduced || !path) {
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(markRef.current, { autoAlpha: 0, filter: "blur(14px)", y: 12 });
    gsap.set(enterRef.current, { autoAlpha: 0, letterSpacing: "0.1em" });

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(path, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" })
      .to(markRef.current, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
      .to(path, { autoAlpha: 0, duration: 0.6 }, "-=0.4")
      .to(enterRef.current, { autoAlpha: 1, letterSpacing: "0.4em", duration: 0.7, ease: "power2.out" }, "-=0.2")
      .to({}, { duration: 0.5 })
      .to(root.current, { yPercent: -100, duration: 1.1, ease: "power4.inOut" });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ivory"
    >
      <svg viewBox="0 0 300 120" className="w-[min(60vw,320px)] text-clay" aria-hidden>
        <path
          ref={pathRef}
          d="M20 60 C 40 20, 70 20, 90 60 S 140 100, 160 60 S 210 20, 230 60 S 280 100, 292 62"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <Wordmark ref={markRef} className="w-[min(70vw,420px)] text-ink" />
      <span
        ref={enterRef}
        className="font-sans text-[0.62rem] uppercase tracking-[0.4em] text-ash"
      >
        Entrando
      </span>
    </div>
  );
}
