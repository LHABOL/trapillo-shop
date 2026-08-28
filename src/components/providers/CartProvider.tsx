"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import { site } from "@/lib/site";

const STORAGE_KEY = "trapillo.cart.v1";

type AddInput = { product: Product; colorName: string; quantity?: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (input: AddInput) => void;
  remove: (productId: string, color: string) => void;
  setQty: (productId: string, color: string, quantity: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* almacenamiento no disponible */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = useCallback(({ product, colorName, quantity = 1 }: AddInput) => {
    const color =
      product.colors.find((c) => c.name === colorName) ?? product.colors[0];
    setLines((prev) => {
      const idx = prev.findIndex(
        (l) => l.productId === product.id && l.color === color.name,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          color: color.name,
          colorHex: color.hex,
          quantity,
          silhouette: product.silhouette,
        },
      ];
    });
  }, []);

  const remove = useCallback((productId: string, color: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.color === color)),
    );
  }, []);

  const setQty = useCallback(
    (productId: string, color: string, quantity: number) => {
      setLines((prev) =>
        prev
          .map((l) =>
            l.productId === productId && l.color === color
              ? { ...l, quantity }
              : l,
          )
          .filter((l) => l.quantity > 0),
      );
    },
    [],
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const shipping =
      subtotal === 0 || subtotal >= site.shipping.freeThreshold
        ? 0
        : site.shipping.flatRate;
    return {
      lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      setQty,
      clear,
    };
  }, [lines, isOpen, add, remove, setQty, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
