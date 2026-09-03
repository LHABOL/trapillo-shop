import type { Metadata } from "next";
import { Customizer } from "@/components/personaliza/Customizer";

export const metadata: Metadata = {
  title: "Personalización",
  description:
    "Diseña tu bolsa tejida a mano: elige el modelo, el color del hilo y los accesorios y míralos al instante sobre la pieza.",
};

export default function PersonalizacionPage() {
  return (
    <main className="min-h-screen bg-ivory pt-24 md:pt-32">
      <header className="container-editorial max-w-2xl pb-12 md:pb-16">
        <span className="eyebrow">Personalización</span>
        <h1 className="display mt-4 text-walnut">Tú eliges cada hilo.</h1>
        <p className="mt-6 text-lg text-ash">
          Arma tu bolsa paso a paso. Cambia el color del hilo y suma accesorios: la
          pieza se transforma en tiempo real, como en una pasarela. Cuando te guste,
          nos la mandas por WhatsApp y la tejemos a mano para ti.
        </p>
      </header>
      <Customizer />
    </main>
  );
}
