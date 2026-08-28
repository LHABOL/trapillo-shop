"use client";

import { useId } from "react";

type Kind = "hilo" | "punto" | "remate";

/** Textura macro procedural (turbulence + trazos) — sustituye a la fotografía. */
export function MacroTexture({ kind, className }: { kind: Kind; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const f = `mt-${uid}`;

  return (
    <svg viewBox="0 0 400 400" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <filter id={f}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" seed={kind.length * 7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.66  0 0 0 0 0.52  0 0 0 0 0.36  0 0 0 0.9 0" />
        </filter>
        <radialGradient id={`${f}-light`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F4EFE6" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#CDB89A" stopOpacity="0" />
          <stop offset="100%" stopColor="#3E2C20" stopOpacity="0.45" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill="#B99873" />
      <rect width="400" height="400" filter={`url(#${f})`} opacity="0.5" />

      {kind === "hilo" &&
        Array.from({ length: 26 }).map((_, i) => (
          <path
            key={i}
            d={`M -20 ${i * 16 + 8} C 100 ${i * 16 - 10}, 300 ${i * 16 + 26}, 420 ${i * 16 + 4}`}
            fill="none"
            stroke={i % 2 ? "#6F4E37" : "#8A5E3C"}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}

      {kind === "punto" &&
        Array.from({ length: 16 }).map((_, r) =>
          Array.from({ length: 16 }).map((_, c) => (
            <path
              key={`${r}-${c}`}
              d={`M ${c * 26 - 6} ${r * 26 + (c % 2 ? 0 : 13)} q 13 -18 26 0 q -13 18 -26 0`}
              fill="none"
              stroke={(r + c) % 2 ? "#5F4130" : "#7A553C"}
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
              stroke={i % 3 ? "#654431" : "#8A5E3C"}
              strokeWidth={6}
              fill="none"
              opacity={0.8}
            />
          ))}
          <path d="M 20 200 H 380" stroke="#3E2C20" strokeWidth={10} opacity={0.5} strokeDasharray="14 10" />
        </>
      )}

      <rect width="400" height="400" fill={`url(#${f}-light)`} />
    </svg>
  );
}
