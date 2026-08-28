"use client";

import { useId } from "react";

type Kind = "hilo" | "punto" | "remate";

const PALETTE: Record<Kind, { base: string; a: string; b: string }> = {
  hilo: { base: "#FF8A63", a: "#FF6B4A", b: "#E8482C" },
  punto: { base: "#25C9C9", a: "#12A5A5", b: "#0C8585" },
  remate: { base: "#9E63E0", a: "#8B46D9", b: "#6B2FB0" },
};

/** Textura macro procedural (turbulence + trazos) — sustituye a la fotografía. */
export function MacroTexture({ kind, className }: { kind: Kind; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const f = `mt-${uid}`;
  const c = PALETTE[kind];

  return (
    <svg viewBox="0 0 400 400" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <filter id={f}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" seed={kind.length * 7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.14  0 0 0 0 0.09  0 0 0 0 0.25  0 0 0 0.6 0" />
        </filter>
        <radialGradient id={`${f}-light`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFF9F2" stopOpacity="0.6" />
          <stop offset="55%" stopColor={c.base} stopOpacity="0" />
          <stop offset="100%" stopColor="#241640" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill={c.base} />
      <rect width="400" height="400" filter={`url(#${f})`} opacity="0.45" />

      {kind === "hilo" &&
        Array.from({ length: 26 }).map((_, i) => (
          <path
            key={i}
            d={`M -20 ${i * 16 + 8} C 100 ${i * 16 - 10}, 300 ${i * 16 + 26}, 420 ${i * 16 + 4}`}
            fill="none"
            stroke={i % 2 ? c.a : c.b}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}

      {kind === "punto" &&
        Array.from({ length: 16 }).map((_, r) =>
          Array.from({ length: 16 }).map((_, col) => (
            <path
              key={`${r}-${col}`}
              d={`M ${col * 26 - 6} ${r * 26 + (col % 2 ? 0 : 13)} q 13 -18 26 0 q -13 18 -26 0`}
              fill="none"
              stroke={(r + col) % 2 ? c.a : c.b}
              strokeWidth={5}
              opacity={0.85}
            />
          )),
        )}

      {kind === "remate" && (
        <>
          {Array.from({ length: 22 }).map((_, i) => (
            <path
              key={i}
              d={`M ${i * 19 + 4} 40 V 360 M ${i * 19 + 4} 40 q 9 8 0 18 M ${i * 19 + 4} 342 q 9 8 0 18`}
              stroke={i % 3 ? c.a : c.b}
              strokeWidth={6}
              fill="none"
              opacity={0.8}
            />
          ))}
          <path d="M 20 200 H 380" stroke="#FFC13B" strokeWidth={10} opacity={0.6} strokeDasharray="14 10" />
        </>
      )}

      <rect width="400" height="400" fill={`url(#${f}-light)`} />
    </svg>
  );
}
