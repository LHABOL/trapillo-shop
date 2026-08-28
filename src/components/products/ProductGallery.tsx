"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import type { Product } from "@/lib/types";
import { usePointer } from "@/lib/hooks";

/**
 * Galería de producto: imagen principal grande con movimiento sutil (§18) +
 * miniaturas. Sustituye al visor procedural cuando hay fotografía real.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const pointer = usePointer(0.05);
  const images = product.images;

  useEffect(() => {
    registerGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !frame.current) return;
    gsap.fromTo(
      frame.current,
      { autoAlpha: 0, y: 34, filter: "blur(14px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
    );
    const float = gsap.to(inner.current, {
      y: "+=10",
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      float.kill();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={frame}
        className="relative aspect-[4/5] overflow-hidden rounded-sm bg-linen/50 ring-1 ring-ink/10 md:sticky md:top-28"
      >
        <div
          ref={inner}
          className="absolute inset-[-4%]"
          style={{
            transform: `translate3d(${pointer.x * 10}px, ${pointer.y * 10}px, 0) scale(1.06)`,
          }}
        >
          {images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-700 ease-cinema"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 vignette rounded-sm" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              data-cursor="VER"
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative aspect-square w-20 overflow-hidden rounded-sm ring-1 transition-all ${
                i === active ? "ring-2 ring-ink" : "ring-ink/15 hover:ring-ink/40"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
