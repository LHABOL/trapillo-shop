"use client";

import { forwardRef } from "react";
import { site } from "@/lib/site";

type Props = {
  className?: string;
  /** "draw" deja el texto sólo con contorno para animar stroke-dashoffset */
  mode?: "fill" | "draw";
  title?: string;
};

/**
 * Wordmark "Gaby Arévalo" como SVG. En modo "draw" el hilo (stroke) puede
 * dibujarse con stroke-dasharray (loader §31 y cierre §20).
 */
export const Wordmark = forwardRef<SVGSVGElement, Props>(function Wordmark(
  { className, mode = "fill", title = site.name },
  ref,
) {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 760 110"
      role="img"
      aria-label={title}
    >
      <text
        x="380"
        y="78"
        textAnchor="middle"
        textLength="700"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="72"
        fontStyle="italic"
        fontWeight="400"
        fill={mode === "fill" ? "currentColor" : "none"}
        stroke={mode === "draw" ? "currentColor" : "none"}
        strokeWidth={mode === "draw" ? 1 : 0}
        paintOrder="stroke"
      >
        {site.name}
      </text>
    </svg>
  );
});
