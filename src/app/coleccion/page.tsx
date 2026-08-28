import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { CollectionGrid } from "@/components/products/CollectionGrid";

export const metadata: Metadata = {
  title: "Colección",
  description: "Todos los modelos de bolsas tejidas TRAPILLO.",
};

export default function ColeccionPage() {
  return (
    <PageShell
      eyebrow="Tienda"
      title="La colección"
      intro="Seis modelos. Cada uno nace del mismo hilo y termina en un oficio distinto."
    >
      <Suspense fallback={<div className="mt-12 h-40" />}>
        <CollectionGrid />
      </Suspense>
    </PageShell>
  );
}
