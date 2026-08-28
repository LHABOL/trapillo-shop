"use client";

import { useId } from "react";
import type { Product } from "@/lib/types";

type Props = {
  silhouette: Product["silhouette"];
  weave?: Product["weave"];
  colorHex?: string;
  shadeHex?: string;
  className?: string;
  /** dibuja sólo el contorno (para transiciones "hilo → forma") */
  outline?: boolean;
};

const BODIES: Record<Product["silhouette"], string> = {
  tote: "M40 78 L160 78 L150 214 Q100 226 50 214 Z",
  bucket: "M46 84 Q100 66 154 84 L146 196 Q100 224 54 196 Z",
  clutch: "M34 108 L166 108 Q172 108 172 116 L168 176 Q168 184 160 184 L40 184 Q32 184 32 176 L28 116 Q28 108 34 108 Z",
  backpack: "M48 92 Q48 74 68 74 L132 74 Q152 74 152 92 L150 200 Q100 214 50 200 Z",
  market: "M30 74 L170 74 L156 210 Q100 224 44 210 Z",
};

const HANDLES: Record<Product["silhouette"], string> = {
  tote: "M62 80 Q68 26 100 26 Q132 26 138 80",
  bucket: "M70 82 Q100 58 130 82",
  clutch: "M60 108 Q100 92 140 108",
  backpack: "M70 76 Q64 40 92 34 M130 76 Q136 40 108 34",
  market: "M56 76 Q64 30 100 30 Q136 30 144 76",
};

export function BagSilhouette({
  silhouette,
  weave = "cerrada",
  colorHex = "#CDB89A",
  shadeHex = "#A9835B",
  className,
  outline = false,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const knit = `knit-${uid}`;
  const soft = `soft-${uid}`;
  const gap = weave === "calada" ? 9 : weave === "punto-alto" ? 11 : weave === "espiga" ? 7 : 6;

  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-label={`Bolsa ${silhouette}`}>
      <defs>
        <pattern id={knit} width={gap} height={gap} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width={gap} height={gap} fill={colorHex} />
          <path d={`M0 ${gap / 2} H${gap}`} stroke={shadeHex} strokeWidth={weave === "calada" ? 1 : 1.6} opacity={0.5} />
          <path d={`M${gap / 2} 0 V${gap}`} stroke={shadeHex} strokeWidth={0.8} opacity={0.28} />
        </pattern>
        <filter id={soft} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1C1712" floodOpacity="0.18" />
        </filter>
      </defs>

      {outline ? (
        <>
          <path d={HANDLES[silhouette]} fill="none" stroke={shadeHex} strokeWidth={2} strokeLinecap="round" />
          <path d={BODIES[silhouette]} fill="none" stroke={shadeHex} strokeWidth={2} strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path
            d={HANDLES[silhouette]}
            fill="none"
            stroke={shadeHex}
            strokeWidth={silhouette === "backpack" ? 9 : 7}
            strokeLinecap="round"
          />
          <g filter={`url(#${soft})`}>
            <path d={BODIES[silhouette]} fill={`url(#${knit})`} stroke={shadeHex} strokeWidth={1.5} strokeLinejoin="round" />
          </g>
          <ellipse cx={100} cy={silhouette === "clutch" ? 108 : silhouette === "market" ? 74 : 80} rx={silhouette === "clutch" ? 68 : 58} ry={6} fill="none" stroke={shadeHex} strokeWidth={2.5} opacity={0.5} />
        </>
      )}
    </svg>
  );
}
