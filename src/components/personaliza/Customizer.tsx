"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { registerGsap, gsap } from "@/lib/gsap";
import { site } from "@/lib/site";
import { useReducedMotion } from "@/lib/hooks";
import { BASE_BAGS, YARNS, ACCESSORIES } from "@/lib/personaliza";
import { AccessoryLayer } from "@/components/personaliza/Accessory";

export function Customizer() {
  const reduced = useReducedMotion();

  const [bagId, setBagId] = useState<string | null>(null);
  const [yarnId, setYarnId] = useState("coral");
  const [accIds, setAccIds] = useState<string[]>([]);
  const [initials, setInitials] = useState("");

  const bag = useMemo(() => BASE_BAGS.find((b) => b.id === bagId) ?? null, [bagId]);
  const yarn = useMemo(() => YARNS.find((y) => y.id === yarnId) ?? YARNS[0], [yarnId]);
  const accessories = useMemo(
    () => ACCESSORIES.filter((a) => accIds.includes(a.id)),
    [accIds],
  );

  const stageInner = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const bagLayers = useRef<HTMLDivElement>(null);
  const prevAcc = useRef<string[]>([]);
  const firstYarn = useRef(true);

  /* pasarela: vaivén continuo + barrido de luz */
  useEffect(() => {
    if (reduced) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.to(stageInner.current, {
        rotation: 1.6,
        y: -6,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 8%",
      });
      gsap.to(shadow.current, {
        scaleX: 0.82,
        opacity: 0.5,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.set(sweep.current, { xPercent: -120, opacity: 0 });
      gsap.to(sweep.current, {
        keyframes: [
          { opacity: 0.9, duration: 0.2 },
          { xPercent: 120, opacity: 0, duration: 1.6, ease: "power1.in" },
        ],
        repeat: -1,
        repeatDelay: 4.5,
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  /* cambio de color → destello + barrido inmediato */
  useEffect(() => {
    if (firstYarn.current) {
      firstYarn.current = false;
      return;
    }
    if (reduced || !bagLayers.current) return;
    gsap.fromTo(
      bagLayers.current,
      { filter: "brightness(1.28) saturate(1.2)", scale: 1.03 },
      { filter: "brightness(1) saturate(1)", scale: 1, duration: 0.6, ease: "power2.out" },
    );
    if (sweep.current) {
      gsap.fromTo(
        sweep.current,
        { xPercent: -120, opacity: 0.95 },
        { xPercent: 120, opacity: 0, duration: 0.9, ease: "power1.in" },
      );
    }
  }, [yarnId, reduced]);

  /* bolsa elegida → entra en escena */
  useEffect(() => {
    if (reduced || !bag || !bagLayers.current) return;
    gsap.fromTo(
      bagLayers.current,
      { opacity: 0, y: 26, scale: 0.92, filter: "blur(8px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
    );
  }, [bagId, reduced, bag]);

  /* accesorio añadido → cae y se acomoda */
  useEffect(() => {
    const added = accIds.filter((id) => !prevAcc.current.includes(id));
    prevAcc.current = accIds;
    if (reduced || !added.length) return;
    added.forEach((id) => {
      gsap.fromTo(
        `[data-acc="${id}"]`,
        { y: -22, opacity: 0, rotate: -12 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.75, ease: "back.out(2)" },
      );
    });
  }, [accIds, reduced]);

  const toggleAcc = (id: string) =>
    setAccIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const waHref = useMemo(() => {
    if (!bag) return site.contact.whatsapp.href;
    const text = [
      "Hola Gaby, quiero personalizar una bolsa 🧶",
      "",
      `Modelo: ${bag.name}`,
      `Color de hilo: ${yarn.name}`,
      accessories.length
        ? `Accesorios: ${accessories.map((a) => a.name).join(", ")}`
        : "Accesorios: sin extras",
      initials.trim() ? `Iniciales: ${initials.trim().toUpperCase()}` : null,
      "",
      "¿Me confirmas disponibilidad y precio?",
    ]
      .filter((l) => l !== null)
      .join("\n");
    return `${site.contact.whatsapp.href}?text=${encodeURIComponent(text)}`;
  }, [bag, yarn, accessories, initials]);

  const maskStyle = bag
    ? {
        background: yarn.hex,
        WebkitMaskImage: `url(${bag.img})`,
        maskImage: `url(${bag.img})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        transition: "background 450ms cubic-bezier(0.16,1,0.3,1)",
      }
    : undefined;

  return (
    <section className="bg-ivory pb-24 md:pb-32">
      <div className="container-editorial grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
        {/* ESCENARIO */}
        <div className="lg:sticky lg:top-24">
          <div
            className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[4px] bg-linen/40 ring-1 ring-ink/10"
            style={{ aspectRatio: String(bag?.ratio ?? 0.8) }}
          >
            {/* fondo de pasarela: halo del color + piso */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 78% at 50% 12%, ${yarn.hex}22, transparent 70%)`,
                transition: "background 450ms",
              }}
            />
            <div
              className="absolute inset-x-0"
              style={{
                top: "82%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(36,22,64,0.22), transparent)",
              }}
            />
            <div
              ref={shadow}
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: "9%",
                width: "56%",
                height: "5%",
                background: "radial-gradient(closest-side, rgba(36,22,64,0.32), transparent)",
              }}
            />

            {/* grupo que oscila */}
            <div ref={stageInner} className="absolute inset-0" style={{ isolation: "isolate" }}>
              {bag ? (
                <div ref={bagLayers} className="absolute inset-0">
                  {accessories
                    .filter((a) => a.id === "bandolera")
                    .map((a) => (
                      <AccessoryLayer key={a.id} accessory={a} bag={bag} yarn={yarn} />
                    ))}

                  {/* capa de color, recortada por la silueta */}
                  <div className="absolute inset-0 z-10" style={maskStyle} />
                  {/* tejido y sombras del dibujo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bag.img}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 z-20 h-full w-full object-contain mix-blend-multiply"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bag.img}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 z-20 h-full w-full object-contain opacity-30 mix-blend-soft-light"
                  />

                  {accessories
                    .filter((a) => a.id !== "bandolera")
                    .map((a) => (
                      <AccessoryLayer key={a.id} accessory={a} bag={bag} yarn={yarn} />
                    ))}

                  {initials.trim() && (
                    <div
                      className="absolute z-30 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[50%] font-serif text-ivory shadow-[0_6px_16px_rgba(36,22,64,0.25)]"
                      style={{
                        left: `${bag.anchors.body[0]}%`,
                        top: `${bag.anchors.body[1]}%`,
                        width: "18%",
                        aspectRatio: "1.35",
                        background: yarn.shade,
                        transform: `translate(-50%,-50%) rotate(-6deg)`,
                        fontSize: "clamp(0.7rem, 2.2vw, 1rem)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {initials.trim().toUpperCase().slice(0, 3)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 grid place-items-center px-8 text-center">
                  <div>
                    <div className="mx-auto mb-5 h-12 w-12 animate-[spin_9s_linear_infinite] rounded-full border border-dashed border-ink/30" />
                    <p className="font-serif text-lg italic text-ash">
                      Elige un modelo para empezar a tejer tu bolsa.
                    </p>
                  </div>
                </div>
              )}

              {/* barrido de luz de pasarela */}
              <div
                ref={sweep}
                className="pointer-events-none absolute inset-0 z-40"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.55) 50%, transparent 58%)",
                  mixBlendMode: "overlay",
                }}
              />
            </div>
          </div>

          {bag && (
            <p className="mt-5 text-center text-[0.7rem] uppercase tracking-[0.24em] text-ash">
              {bag.name} · hilo {yarn.name}
              {accessories.length ? ` · ${accessories.length} accesorio${accessories.length > 1 ? "s" : ""}` : ""}
            </p>
          )}
        </div>

        {/* CONTROLES */}
        <div className="space-y-10">
          <Step n={1} title="Elige tu modelo">
            <div className="grid gap-3 sm:grid-cols-3">
              {BASE_BAGS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBagId(b.id)}
                  data-cursor={b.name}
                  className={clsx(
                    "group rounded-[3px] border p-3 text-left transition-colors",
                    bagId === b.id
                      ? "border-ink bg-ink/[0.04]"
                      : "border-ink/15 hover:border-ink/45",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.img}
                    alt={`Modelo ${b.name}`}
                    className="mx-auto h-20 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100"
                  />
                  <p className="mt-2 font-serif text-base text-ink">{b.name}</p>
                  <p className="text-[0.72rem] leading-snug text-ash">{b.note}</p>
                </button>
              ))}
            </div>
          </Step>

          <Step n={2} title="Color del hilo" muted={!bag} hint={!bag ? "Primero elige un modelo." : undefined}>
            {bag && (
              <>
                <div className="flex flex-wrap gap-2.5">
                  {YARNS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setYarnId(c.id)}
                      aria-label={c.name}
                      aria-pressed={yarnId === c.id}
                      data-cursor={c.name}
                      className={clsx(
                        "h-9 w-9 rounded-full ring-1 ring-ink/15 transition-transform",
                        yarnId === c.id ? "scale-110 ring-2 ring-ink" : "hover:scale-105",
                      )}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[0.72rem] uppercase tracking-[0.2em] text-ash">{yarn.name}</p>
              </>
            )}
          </Step>

          <Step n={3} title="Accesorios" muted={!bag} hint={!bag ? "Primero elige un modelo." : "Puedes combinar varios."}>
            {bag && (
              <div className="flex flex-wrap gap-2">
                {ACCESSORIES.map((a) => {
                  const on = accIds.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAcc(a.id)}
                      aria-pressed={on}
                      data-cursor={a.name}
                      title={a.hint}
                      className={clsx(
                        "rounded-full border px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
                        on ? "border-clay bg-clay text-ivory" : "border-ink/25 text-ink/70 hover:border-ink/60",
                      )}
                    >
                      {a.name}
                    </button>
                  );
                })}
              </div>
            )}
          </Step>

          <Step n={4} title="Iniciales" muted={!bag} hint={!bag ? "Primero elige un modelo." : "Opcional · hasta 3 letras bordadas."}>
            {bag && (
              <input
                type="text"
                inputMode="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value.replace(/[^a-zA-ZñÑ ]/g, ""))}
                placeholder="GA"
                className="w-32 rounded-[3px] border border-ink/25 bg-transparent px-4 py-2.5 font-serif text-lg uppercase tracking-[0.2em] text-ink outline-none placeholder:text-ash/50 focus:border-ink"
              />
            )}
          </Step>

          {/* resumen + pedido */}
          <div className="rounded-[4px] border border-ink/15 bg-cream/40 p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-ash">Tu bolsa</p>
            <p className="mt-2 font-serif text-xl text-walnut">
              {bag ? `${bag.name} en hilo ${yarn.name}` : "Sin configurar todavía"}
            </p>
            {bag && (accessories.length > 0 || initials.trim()) && (
              <p className="mt-1 text-sm text-ash">
                {[
                  accessories.map((a) => a.name).join(", "),
                  initials.trim() ? `iniciales ${initials.trim().toUpperCase()}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!bag}
                data-cursor="WHATSAPP"
                className={clsx(
                  "inline-flex items-center justify-center rounded-full px-7 py-3 text-[0.72rem] uppercase tracking-[0.22em] transition-colors",
                  bag
                    ? "bg-ink text-ivory hover:bg-walnut"
                    : "pointer-events-none bg-ink/20 text-ivory/70",
                )}
              >
                Pedir por WhatsApp
              </a>
              <a
                href={site.contact.instagram.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="INSTAGRAM"
                className="inline-flex items-center justify-center rounded-full border border-ink/30 px-7 py-3 text-[0.72rem] uppercase tracking-[0.22em] text-ink/80 transition-colors hover:border-ink"
              >
                Escríbenos por Instagram
              </a>
            </div>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-ash">
              Cada pieza se teje a mano por encargo. Te confirmamos precio y tiempo de entrega al recibir tu mensaje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  hint,
  muted,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(muted && "opacity-45")}>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-sm text-clay">{String(n).padStart(2, "0")}</span>
        <h2 className="font-serif text-xl text-ink">{title}</h2>
      </div>
      {hint && <p className="mb-3 text-[0.72rem] uppercase tracking-[0.18em] text-ash">{hint}</p>}
      {children}
    </div>
  );
}
