"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import clsx from "clsx";
import { useCart } from "@/components/providers/CartProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { site, formatMXN } from "@/lib/site";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";

export function CartDrawer() {
  const cart = useCart();
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    if (cart.isOpen) stop();
    else start();
    return () => start();
  }, [cart.isOpen, stop, start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart]);

  const remaining = site.shipping.freeThreshold - cart.subtotal;

  return (
    <>
      <div
        onClick={cart.close}
        className={clsx(
          "fixed inset-0 z-[65] bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500",
          cart.isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />
      <aside
        aria-hidden={!cart.isOpen}
        className={clsx(
          "fixed inset-y-0 right-0 z-[66] flex w-full max-w-[440px] flex-col bg-ivory shadow-2xl transition-transform duration-[650ms] ease-cinema",
          cart.isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-serif text-xl">Tu carrito</h2>
          <button
            type="button"
            onClick={cart.close}
            data-cursor="CERRAR"
            className="text-[0.7rem] uppercase tracking-[0.22em] text-ink/60 hover:text-ink"
          >
            Cerrar
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-serif text-lg text-ink/70">Todavía no hay hilo aquí.</p>
            <Link
              href="/coleccion"
              onClick={cart.close}
              className="border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.22em]"
            >
              Ver la colección
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
              {cart.lines.map((l) => (
                <li key={`${l.productId}-${l.color}`} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-linen/60">
                    {l.image ? (
                      <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                    ) : (
                      <BagSilhouette silhouette={l.silhouette} colorHex={l.colorHex} className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/producto/${l.slug}`}
                      onClick={cart.close}
                      className="font-serif text-[0.98rem] leading-tight hover:underline"
                    >
                      {l.name}
                    </Link>
                    <span className="mt-0.5 text-[0.7rem] uppercase tracking-[0.18em] text-ash">
                      {l.color}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-ink/20">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm hover:bg-ink/5"
                          onClick={() => cart.setQty(l.productId, l.color, l.quantity - 1)}
                          aria-label="Quitar una unidad"
                        >
                          –
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{l.quantity}</span>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm hover:bg-ink/5"
                          onClick={() => cart.setQty(l.productId, l.color, l.quantity + 1)}
                          aria-label="Añadir una unidad"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-sans text-sm tabular-nums">
                        {formatMXN(l.price * l.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink/10 px-6 py-5">
              {remaining > 0 ? (
                <p className="mb-3 text-[0.72rem] tracking-wide text-ash">
                  Te faltan {formatMXN(remaining)} para el envío gratis.
                </p>
              ) : (
                <p className="mb-3 text-[0.72rem] tracking-wide text-clay">Envío gratis aplicado.</p>
              )}
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ash">Subtotal</dt>
                  <dd className="tabular-nums">{formatMXN(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ash">Envío</dt>
                  <dd className="tabular-nums">
                    {cart.shipping === 0 ? "Gratis" : formatMXN(cart.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-ink/10 pt-2 font-serif text-base">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMXN(cart.total)}</dd>
                </div>
              </dl>
              <Link
                href="/carrito"
                onClick={cart.close}
                data-cursor="IR AL PAGO"
                className="mt-4 block bg-ink py-4 text-center font-sans text-[0.72rem] uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-walnut"
              >
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
