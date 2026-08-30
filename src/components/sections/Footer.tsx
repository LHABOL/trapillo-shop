import Link from "next/link";
import { site } from "@/lib/site";

const cols = [
  {
    title: "Colección",
    links: [
      { label: "Todos los modelos", href: "/coleccion" },
      { label: "Totes", href: "/coleccion?cat=tote" },
      { label: "Cestos", href: "/coleccion?cat=cesto" },
      { label: "Encargos a medida", href: "/contacto" },
    ],
  },
  {
    title: "Casa",
    links: [
      { label: "Historia", href: "/historia" },
      { label: "Contacto", href: "/contacto" },
      { label: "Carrito", href: "/carrito" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Políticas de envío", href: "/contacto" },
      { label: "Cambios y devoluciones", href: "/contacto" },
      { label: "Términos", href: "/contacto" },
      { label: "Privacidad", href: "/contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="footer-thread" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FF6B4A" />
            <stop offset="0.5" stopColor="#FFC13B" />
            <stop offset="1" stopColor="#17C4C4" />
          </linearGradient>
        </defs>
        <path
          d="M0 20 C 200 80, 400 -20, 600 40 S 1000 90, 1200 30"
          fill="none"
          stroke="url(#footer-thread)"
          strokeWidth="2"
        />
      </svg>

      <div className="container-editorial relative pb-10 pt-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl italic tracking-[0.06em]">{site.name}</p>
            <p className="mt-3 max-w-xs text-sm text-ivory/60">{site.description}</p>
            <div className="mt-6 flex gap-5 text-[0.7rem] uppercase tracking-[0.2em] text-ivory/70">
              <a href={site.contact.instagram.href} target="_blank" rel="noreferrer" className="link-underline">
                Instagram
              </a>
              <a href={site.contact.whatsapp.href} target="_blank" rel="noreferrer" className="link-underline">
                WhatsApp
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <nav key={col.title}>
              <p className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-ivory/45">{col.title}</p>
              <ul className="space-y-2.5 text-sm text-ivory/75">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="link-underline hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-ivory/10 pt-6 text-[0.66rem] uppercase tracking-[0.2em] text-ivory/40 md:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name} · Hecho a mano en México
          </span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
