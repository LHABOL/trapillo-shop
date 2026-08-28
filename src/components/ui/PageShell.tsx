import type { ReactNode } from "react";

/** Contenedor para las rutas internas: deja aire para la navbar fija. */
export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ivory pb-28 pt-28 md:pt-36">
      <div className="container-editorial">
        <header className="max-w-2xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="display mt-4 text-walnut">{title}</h1>
          {intro && <p className="mt-6 text-lg text-ash">{intro}</p>}
        </header>
        {children}
      </div>
    </main>
  );
}
