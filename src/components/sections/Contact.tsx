"use client";

import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const CHANNELS = [
  { label: "WhatsApp", value: site.contact.whatsapp.label, href: site.contact.whatsapp.href },
  { label: "Instagram", value: site.contact.instagram.label, href: site.contact.instagram.href },
  { label: "Email", value: site.contact.email.label, href: site.contact.email.href },
  { label: "Teléfono", value: site.contact.phone.label, href: site.contact.phone.href },
];

export function Contact() {
  return (
    <section id="contacto" className="border-t border-ink/10 bg-ivory py-24 md:py-36">
      <div className="container-editorial grid gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="eyebrow">Contacto</span>
          <h2 className="display mt-4 text-walnut">Hablemos.</h2>
          <p className="mt-6 max-w-sm text-ash">
            Encargos a medida, mayoreo, dudas sobre una pieza. Respondemos en el
            día.
          </p>
          <p className="mt-8 text-[0.7rem] uppercase tracking-[0.22em] text-ash">
            {site.contact.hours}
          </p>
        </Reveal>

        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {CHANNELS.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="ABRIR"
                className="group flex items-center justify-between py-6 transition-colors hover:text-clay"
              >
                <span className="font-serif text-2xl">{c.label}</span>
                <span className="flex items-center gap-3 text-sm text-ash">
                  {c.value}
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
