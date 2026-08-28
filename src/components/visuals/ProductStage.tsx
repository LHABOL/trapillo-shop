"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";
import { useIsMobile, useLowPower, useReducedMotion } from "@/lib/hooks";

const Bag3D = dynamic(() => import("@/components/visuals/Bag3D"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  silhouette: Product["silhouette"];
  weave: Product["weave"];
  colorHex: string;
  shadeHex: string;
  className?: string;
  /** fuerza 2D (tarjetas, listas) */
  flat?: boolean;
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Muestra el visor 3D (Three.js) en equipos capaces; cae con elegancia a la
 * silueta SVG en mobile, low-power, reduced-motion o sin WebGL.
 */
export function ProductStage({ silhouette, weave, colorHex, shadeHex, className, flat }: Props) {
  const isMobile = useIsMobile();
  const lowPower = useLowPower();
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWebgl(hasWebGL());
    setMounted(true);
  }, []);

  const use3D = mounted && !flat && !isMobile && !lowPower && !reduced && webgl;

  if (use3D) {
    return (
      <Bag3D
        silhouette={silhouette}
        weave={weave}
        colorHex={colorHex}
        shadeHex={shadeHex}
        className={className}
      />
    );
  }

  return (
    <BagSilhouette
      silhouette={silhouette}
      weave={weave}
      colorHex={colorHex}
      shadeHex={shadeHex}
      className={className}
    />
  );
}
