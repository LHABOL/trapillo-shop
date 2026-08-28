"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { site } from "@/lib/site";
import { useCart } from "@/components/providers/CartProvider";
import { Magnetic } from "@/components/ui/Magnetic";

export function Navbar() {
  const pathname = usePathname();
  const cart = useCart();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.6);
      setHidden(y > last && y > 320);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinema",
        hidden ? "-translate-y-full" : "translate-y-0",
        solid
          ? "border-b border-ink/10 bg-ivory/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-editorial flex h-16 items-center justify-between md:h-20">
        <Magnetic strength={0.2}>
          <Link
            href="/"
            data-cursor="INICIO"
            className={clsx(
              "font-serif text-lg tracking-[0.28em] transition-colors md:text-xl",
              solid ? "text-ink" : "text-ink",
            )}
          >
            {site.name}
          </Link>
        </Magnetic>

        <div className="flex items-center gap-6 md:gap-10">
          <ul className="hidden items-center gap-8 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-ink/70 md:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-cursor=""
                  className={clsx(
                    "link-underline py-2 transition-colors hover:text-ink",
                    pathname === item.href && "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            id="cart-icon"
            type="button"
            onClick={cart.open}
            data-cursor="VER CARRITO"
            aria-label={`Carrito, ${cart.count} artículos`}
            className="relative flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.22em] text-ink/80 transition-colors hover:text-ink"
          >
            <span className="hidden sm:inline">Carrito</span>
            <span className="grid h-7 min-w-7 place-items-center rounded-full border border-ink/40 px-1 text-[0.68rem] tabular-nums">
              {cart.count}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
