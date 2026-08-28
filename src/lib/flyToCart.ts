"use client";

import { gsap } from "@/lib/gsap";

/**
 * "El hilo viaja hacia el carrito" (§18). Clona un punto del producto y lo lleva
 * por una curva bézier hasta el icono del carrito, dejando un rastro de hilo.
 */
export function flyToCart(origin: HTMLElement | null, colorHex = "#FF6B4A") {
  if (typeof window === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = document.getElementById("cart-icon");
  if (!origin || !target) {
    pulseCart(target);
    return;
  }

  const o = origin.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const start = { x: o.left + o.width / 2, y: o.top + o.height / 2 };
  const end = { x: t.left + t.width / 2, y: t.top + t.height / 2 };

  if (reduced) {
    pulseCart(target);
    return;
  }

  const dot = document.createElement("span");
  dot.style.cssText = `position:fixed;left:${start.x}px;top:${start.y}px;width:14px;height:14px;border-radius:9999px;background:${colorHex};box-shadow:0 0 0 4px ${colorHex}22;z-index:80;pointer-events:none;`;
  document.body.appendChild(dot);
  gsap.set(dot, { xPercent: -50, yPercent: -50 });

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;z-index:79;pointer-events:none;overflow:visible;";
  const path = document.createElementNS(svgNS, "path");
  const midX = (start.x + end.x) / 2 + (end.x > start.x ? -120 : 120);
  const midY = Math.min(start.y, end.y) - 140;
  const d = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", colorHex);
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  svg.appendChild(path);
  document.body.appendChild(svg);

  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;

  const tl = gsap.timeline({
    onComplete: () => {
      dot.remove();
      svg.remove();
      pulseCart(target);
    },
  });

  tl.to(path, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0);
  tl.to(
    dot,
    {
      duration: 0.7,
      ease: "power2.inOut",
      keyframes: [
        { x: midX - start.x, y: midY - start.y, scale: 1.15, duration: 0.35 },
        { x: end.x - start.x, y: end.y - start.y, scale: 0.2, duration: 0.35 },
      ],
    },
    0,
  );
  tl.to(path, { opacity: 0, duration: 0.4 }, 0.7);
}

function pulseCart(target: HTMLElement | null) {
  if (!target) return;
  gsap.fromTo(
    target,
    { scale: 1 },
    { scale: 1.25, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
  );
}
