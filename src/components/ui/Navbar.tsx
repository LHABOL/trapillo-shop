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
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.6);
      setHidden(y > last && y > 320 && !menu);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu]);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinema",
        hidden ? "-translate-y-full" : "translate-y-0",
        solid || menu
          ? "border-b border-ink/10 bg-ivory/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="container-editorial flex h-16 items-center justify-between md:h-20">
        <Magnetic strength={0.2}>
          <Link
            href="/"
            data-cursor="INICIO"
            className="font-serif text-lg tracking-[0.28em] text-ink transition-colors md:text-xl"
          >
            {site.name}
          </Link>
        </Magnetic>

        <div className="flex items-center gap-5 md:gap-10">
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

          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menu}
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={clsx(
                "block h-px w-5 bg-ink transition-transform duration-300",
                menu && "translate-y-[3px] rotate-45",
              )}
            />
            <span
              className={clsx(
                "block h-px w-5 bg-ink transition-transform duration-300",
                menu && "-translate-y-[3px] -rotate-45",
              )}
            />
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={clsx(
          "overflow-hidden border-t border-ink/10 bg-ivory/95 backdrop-blur-md transition-[max-height,opacity] duration-500 ease-cinema md:hidden",
          menu ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="container-editorial flex flex-col py-3">
          {[{ label: "Inicio", href: "/" }, ...site.nav].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMenu(false)}
                className={clsx(
                  "block py-3 font-sans text-[0.8rem] uppercase tracking-[0.24em] text-ink/75",
                  pathname === item.href && "text-clay",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
