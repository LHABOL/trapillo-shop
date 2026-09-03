"use client";

import { forwardRef } from "react";
import type { Accessory, BaseBag, YarnColor } from "@/lib/personaliza";

type Props = {
  accessory: Accessory;
  bag: BaseBag;
  yarn: YarnColor;
};

function tintOf(accessory: Accessory, yarn: YarnColor) {
  switch (accessory.tint) {
    case "gold":
      return { main: "#E7C15B", dark: "#A9822B" };
    case "silver":
      return { main: "#D7DBE0", dark: "#9AA0A8" };
    case "bloom":
      return { main: "#FF7FB0", dark: "#FFC13B" };
    default:
      return { main: yarn.hex, dark: yarn.shade };
  }
}

/**
 * Complemento dibujado sobre la bolsa. Se ancla a un punto de amarre del modelo
 * (en % del escenario) y cuelga desde ahí; el vaivén lo aplica el escenario.
 */
export const AccessoryLayer = forwardRef<HTMLDivElement, Props>(function AccessoryLayer(
  { accessory, bag, yarn },
  ref,
) {
  const c = tintOf(accessory, yarn);

  // correa bandolera: cruza todo el escenario, por detrás del cuerpo de la bolsa
  if (accessory.id === "bandolera") {
    const [lx, ly] = bag.anchors.ringL;
    const [rx, ry] = bag.anchors.ringR;
    return (
      <div ref={ref} data-acc={accessory.id} className="pointer-events-none absolute inset-0 z-0">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <path
            d={`M ${lx} ${ly} C ${lx - 6} ${ly - 34}, ${rx + 6} ${ry - 34}, ${rx} ${ry}`}
            fill="none"
            stroke={c.dark}
            strokeWidth="5.4"
            strokeLinecap="round"
          />
          <path
            d={`M ${lx} ${ly} C ${lx - 6} ${ly - 34}, ${rx + 6} ${ry - 34}, ${rx} ${ry}`}
            fill="none"
            stroke={c.main}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray="0.1 3.4"
          />
        </svg>
      </div>
    );
  }

  const anchorKey =
    accessory.slot === "handle"
      ? "handleR"
      : accessory.slot === "ringL"
        ? "ringL"
        : accessory.slot === "ringR"
          ? "ringR"
          : "body";
  const [ax, ay] = bag.anchors[anchorKey as keyof typeof bag.anchors];
  const nudgeY = accessory.slot === "bodyUpper" ? -20 : 0;
  const width = accessory.id === "flor" ? "13%" : accessory.id === "mosqueton" ? "12%" : "16%";

  return (
    <div
      ref={ref}
      data-acc={accessory.id}
      className="pointer-events-none absolute z-30 origin-top"
      style={{ left: `${ax}%`, top: `${ay + nudgeY}%`, width, transform: "translate(-50%, -6%)" }}
    >
      <svg viewBox="0 0 100 120" className="h-auto w-full overflow-visible">
        {accessory.id === "pompon" && (
          <g>
            <line x1="50" y1="0" x2="50" y2="46" stroke={c.dark} strokeWidth="4" strokeLinecap="round" />
            {Array.from({ length: 28 }).map((_, i) => {
              const a = (i / 28) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={50 + Math.cos(a) * 12}
                  y1={70 + Math.sin(a) * 12}
                  x2={50 + Math.cos(a) * 26}
                  y2={70 + Math.sin(a) * 26}
                  stroke={i % 2 ? c.main : c.dark}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="50" cy="70" r="15" fill={c.main} />
          </g>
        )}

        {accessory.id === "borla" && (
          <g>
            <circle cx="50" cy="10" r="7" fill="none" stroke="#C9A24A" strokeWidth="3.5" />
            <path d="M42 24 L58 24 L55 34 L45 34 Z" fill={c.dark} />
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={i}
                x1={45 + i * 1.3}
                y1="34"
                x2={44 + i * 1.5}
                y2={78 - (i % 3) * 4}
                stroke={i % 2 ? c.main : c.dark}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {accessory.id === "mosqueton" && (
          <g>
            <circle cx="50" cy="12" r="8" fill="none" stroke={c.dark} strokeWidth="3.5" />
            <rect x="34" y="24" width="32" height="60" rx="16" fill="none" stroke={c.main} strokeWidth="7" />
            <rect x="34" y="24" width="32" height="60" rx="16" fill="none" stroke={c.dark} strokeWidth="2.4" />
            <line x1="62" y1="30" x2="62" y2="58" stroke={c.dark} strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {accessory.id === "flor" && (
          <g transform="translate(0,6)">
            <line x1="50" y1="0" x2="50" y2="20" stroke="#C9A24A" strokeWidth="3" />
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return (
                <ellipse
                  key={i}
                  cx={50 + Math.cos(a) * 16}
                  cy={40 + Math.sin(a) * 16}
                  rx="11"
                  ry="7"
                  fill={c.main}
                  transform={`rotate(${(a * 180) / Math.PI} ${50 + Math.cos(a) * 16} ${40 + Math.sin(a) * 16})`}
                />
              );
            })}
            <circle cx="50" cy="40" r="10" fill={c.dark} />
          </g>
        )}
      </svg>
    </div>
  );
});
