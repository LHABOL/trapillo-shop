import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Franja al cierre de la home: invita a la sección de Personalización.
 * No es parte del hilo narrativo — es solo la puerta de entrada al configurador.
 */
export function CustomizeInvite() {
  return (
    <section className="border-t border-ink/10 bg-cream/50">
      <div className="container-editorial flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <Reveal>
          <span className="eyebrow">Personalización</span>
          <h2 className="mt-3 max-w-xl font-serif text-[clamp(1.7rem,4vw,2.8rem)] italic text-walnut">
            ¿Y si la próxima la diseñas tú?
          </h2>
          <p className="mt-3 max-w-md text-sm text-ash">
            Elige modelo, color de hilo y accesorios, y míralos sobre la bolsa en tiempo real.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/personalizacion"
            data-cursor="PERSONALIZAR"
            className="inline-block whitespace-nowrap rounded-full bg-ink px-9 py-4 text-[0.72rem] uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-walnut"
          >
            Personalizar mi bolsa
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
