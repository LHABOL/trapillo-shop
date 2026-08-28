"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatMXN, site } from "@/lib/site";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";

export default function CarritoPage() {
  const cart = useCart();
  const [placed, setPlaced] = useState(false);

  if (placed) {
    return (
      <main className="grid min-h-screen place-items-center bg-ivory px-6 pt-24 text-center">
        <div>
          <p className="eyebrow">Gracias</p>
          <h1 className="display mt-4 text-walnut">El hilo ya viaja hacia ti.</h1>
          <p className="mx-auto mt-6 max-w-md text-ash">
            Recibimos tu pedido. Te escribimos por WhatsApp para confirmar el pago
            y los tiempos de entrega.
          </p>
          <Link
            href="/coleccion"
            className="mt-8 inline-block border-b border-ink pb-1 text-[0.72rem] uppercase tracking-[0.22em]"
          >
            Seguir explorando
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory px-0 pb-28 pt-24 md:pt-32">
      <div className="container-editorial">
        <h1 className="display text-walnut">Tu carrito</h1>

        {cart.lines.length === 0 ? (
          <p className="mt-10 text-ash">
            Está vacío.{" "}
            <Link href="/coleccion" className="border-b border-ink pb-0.5 text-ink">
              Ver la colección
            </Link>
          </p>
        ) : (
          <div className="mt-12 grid gap-16 lg:grid-cols-[1.4fr_1fr]">
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {cart.lines.map((l) => (
                <li key={`${l.productId}-${l.color}`} className="flex gap-6 py-6">
                  <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-sm bg-linen/50">
                    {l.image ? (
                      <Image src={l.image} alt={l.name} fill sizes="112px" className="object-cover" />
                    ) : (
                      <BagSilhouette silhouette={l.silhouette} colorHex={l.colorHex} className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <Link href={`/producto/${l.slug}`} className="font-serif text-lg hover:underline">
                        {l.name}
                      </Link>
                      <span className="tabular-nums">{formatMXN(l.price * l.quantity)}</span>
                    </div>
                    <span className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-ash">{l.color}</span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-ink/20">
                        <button className="px-3 py-1.5 hover:bg-ink/5" onClick={() => cart.setQty(l.productId, l.color, l.quantity - 1)}>
                          –
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">{l.quantity}</span>
                        <button className="px-3 py-1.5 hover:bg-ink/5" onClick={() => cart.setQty(l.productId, l.color, l.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => cart.remove(l.productId, l.color)}
                        className="text-[0.68rem] uppercase tracking-[0.18em] text-ash hover:text-ink"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-sm bg-linen/40 p-8 ring-1 ring-ink/10">
              <h2 className="font-serif text-xl">Resumen</h2>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ash">Subtotal</dt>
                  <dd className="tabular-nums">{formatMXN(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ash">Envío</dt>
                  <dd className="tabular-nums">{cart.shipping === 0 ? "Gratis" : formatMXN(cart.shipping)}</dd>
                </div>
                <div className="mt-3 flex justify-between border-t border-ink/15 pt-3 font-serif text-lg">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMXN(cart.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[0.7rem] text-ash">{site.shipping.copy}</p>
              <button
                onClick={() => {
                  setPlaced(true);
                  cart.clear();
                }}
                data-cursor="CONFIRMAR"
                className="mt-6 w-full bg-ink py-4 text-[0.72rem] uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-walnut"
              >
                Finalizar compra
              </button>
              <p className="mt-3 text-center text-[0.66rem] text-ash">
                Pago y confirmación por WhatsApp. Integración de pasarela pendiente.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
