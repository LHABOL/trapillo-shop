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
 * Wordmark TRAPILLO como SVG. En modo "draw" el hilo (stroke) puede dibujarse
 * con stroke-dasharray (loader §31 y cierre §20).
 */
export const Wordmark = forwardRef<SVGSVGElement, Props>(function Wordmark(
  { className, mode = "fill", title = site.name },
  ref,
) {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 640 96"
      role="img"
      aria-label={title}
    >
      <text
        x="50%"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="88"
        fontWeight="400"
        letterSpacing="10"
        fill={mode === "fill" ? "currentColor" : "none"}
        stroke={mode === "draw" ? "currentColor" : "none"}
        strokeWidth={mode === "draw" ? 1.1 : 0}
        paintOrder="stroke"
      >
        {site.name}
      </text>
    </svg>
  );
});
