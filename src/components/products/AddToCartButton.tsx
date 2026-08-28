"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { flyToCart } from "@/lib/flyToCart";

export function AddToCartButton({
  product,
  colorName,
  variant = "solid",
  openDrawer = false,
  className = "",
  label = "Agregar al carrito",
}: {
  product: Product;
  colorName?: string;
  variant?: "solid" | "line";
  openDrawer?: boolean;
  className?: string;
  label?: string;
}) {
  const cart = useCart();
  const ref = useRef<HTMLButtonElement>(null);
  const [done, setDone] = useState(false);

  if (product.availability === "sold-out") {
    return (
      <span className={`inline-block px-6 py-4 text-[0.72rem] uppercase tracking-[0.24em] text-ash ${className}`}>
        Agotado
      </span>
    );
  }

  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0];

  const onClick = () => {
    cart.add({ product, colorName: color.name });
    flyToCart(ref.current, color.hex);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
    if (openDrawer) setTimeout(() => cart.open(), 700);
  };

  const base =
    "group relative inline-flex items-center justify-center overflow-hidden px-8 py-4 text-[0.72rem] uppercase tracking-[0.26em] transition-colors";
  const skin =
    variant === "solid"
      ? "bg-ink text-ivory hover:bg-walnut"
      : "border border-ink text-ink hover:bg-ink hover:text-ivory";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${product.name}`}
      data-cursor="AGREGAR"
      className={`${base} ${skin} ${className}`}
    >
      <span className="relative z-10">
        {done ? "Añadida ·" : label}
        {product.availability === "made-to-order" && !done ? " · por encargo" : ""}
      </span>
    </button>
  );
}
