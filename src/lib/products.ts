import type { Product } from "./types";

/**
 * Fuente de datos temporal. El esquema (§36 del brief) está listo para
 * sustituirse por Shopify / WooCommerce / Stripe / Supabase / Sanity:
 * basta con reimplementar getAllProducts / getProductBySlug de forma async.
 */

const EARTH: Product["colors"] = [
  { name: "Marfil", hex: "#EDE4D3", shade: "#CDB89A" },
  { name: "Arena", hex: "#CDB89A", shade: "#A9835B" },
  { name: "Arcilla", hex: "#A9835B", shade: "#6F4E37" },
  { name: "Cacao", hex: "#6F4E37", shade: "#3E2C20" },
  { name: "Tinta", hex: "#2A2320", shade: "#1C1712" },
];

export const products: Product[] = [
  {
    id: "p01",
    slug: "modelo-01-luna",
    name: "Modelo 01 · Luna",
    price: 189000,
    currency: "MXN",
    shortDescription: "Tote de tejido calado, asa larga.",
    description:
      "El primer trazo de la colección. Un tote de cuerpo alto y tejido calado que deja pasar la luz. El asa larga cae al hombro y la base plana la mantiene de pie sola. Cada pieza toma cerca de catorce horas de trabajo continuo.",
    silhouette: "tote",
    weave: "calada",
    colors: EARTH,
    materials: ["Trapillo de algodón reciclado", "Base de cartón entretelado", "Hilo encerado en costuras"],
    dimensions: { width: 34, height: 38, depth: 12, unit: "cm" },
    availability: "in-stock",
    category: "tote",
    featured: true,
    attributes: { size: "grande", style: "minimal", occasion: "diario" },
  },
  {
    id: "p02",
    slug: "modelo-02-duna",
    name: "Modelo 02 · Duna",
    price: 164000,
    currency: "MXN",
    shortDescription: "Cesto redondo de punto cerrado.",
    description:
      "Un cesto de tejido cerrado y firme que sostiene su forma con el tiempo. Nace de una espiral que crece desde el centro de la base hasta el borde. Asas cortas, cuerpo generoso.",
    silhouette: "bucket",
    weave: "cerrada",
    colors: EARTH,
    materials: ["Trapillo de algodón reciclado", "Alma de cuerda de yute", "Forro de lino crudo"],
    dimensions: { width: 30, height: 26, depth: 30, unit: "cm" },
    availability: "in-stock",
    category: "cesto",
    featured: true,
    attributes: { size: "media", style: "clasica", occasion: "diario" },
  },
  {
    id: "p03",
    slug: "modelo-03-brasa",
    name: "Modelo 03 · Brasa",
    price: 128000,
    currency: "MXN",
    shortDescription: "Clutch de espiga con cadena oculta.",
    description:
      "La pieza de noche. Tejido en espiga apretada sobre una estructura rígida, con una cadena que se guarda dentro cuando se lleva en mano. Pequeña, densa, deliberada.",
    silhouette: "clutch",
    weave: "espiga",
    colors: [EARTH[2], EARTH[3], EARTH[4]],
    materials: ["Trapillo de algodón mercerizado", "Estructura termoformada", "Cadena de latón envejecido"],
    dimensions: { width: 26, height: 15, depth: 6, unit: "cm" },
    availability: "made-to-order",
    category: "clutch",
    featured: true,
    attributes: { size: "mini", style: "statement", occasion: "noche" },
  },
  {
    id: "p04",
    slug: "modelo-04-marea",
    name: "Modelo 04 · Marea",
    price: 212000,
    currency: "MXN",
    shortDescription: "Bolsa de playa XL, punto alto.",
    description:
      "Grande sin ser pesada. Punto alto y abierto que seca rápido y respira. Boca ancha, asas reforzadas y un bolsillo interior cosido a mano para lo que no debe mojarse.",
    silhouette: "market",
    weave: "punto-alto",
    colors: [EARTH[0], EARTH[1], EARTH[2]],
    materials: ["Trapillo de algodón reciclado", "Asas trenzadas a tres cabos", "Bolsillo interior de lona"],
    dimensions: { width: 46, height: 40, depth: 18, unit: "cm" },
    availability: "in-stock",
    category: "playa",
    featured: true,
    attributes: { size: "grande", style: "clasica", occasion: "playa" },
  },
  {
    id: "p05",
    slug: "modelo-05-nido",
    name: "Modelo 05 · Nido",
    price: 238000,
    currency: "MXN",
    shortDescription: "Mochila estructurada de doble tejido.",
    description:
      "Dos capas de tejido —una calada por fuera, una cerrada por dentro— dan a esta mochila cuerpo y aguante. Tirantes ajustables forrados y solapa con cierre magnético escondido bajo el punto.",
    silhouette: "backpack",
    weave: "cerrada",
    colors: EARTH,
    materials: ["Doble trapillo de algodón", "Tirantes acolchados", "Herrajes de latón macizo"],
    dimensions: { width: 30, height: 40, depth: 14, unit: "cm" },
    availability: "made-to-order",
    category: "mochila",
    featured: false,
    attributes: { size: "grande", style: "minimal", occasion: "trabajo" },
  },
  {
    id: "p06",
    slug: "modelo-06-aire",
    name: "Modelo 06 · Aire",
    price: 96000,
    currency: "MXN",
    shortDescription: "Mini bolsa calada de mano.",
    description:
      "El gesto más pequeño de la colección. Un mini tejido calado para llevar lo esencial, con asa corta y borde rematado en punto festón. Entra en cualquier lado.",
    silhouette: "tote",
    weave: "calada",
    colors: [EARTH[0], EARTH[1], EARTH[3]],
    materials: ["Trapillo fino de algodón", "Remate en punto festón"],
    dimensions: { width: 20, height: 18, depth: 8, unit: "cm" },
    availability: "in-stock",
    category: "tote",
    featured: false,
    attributes: { size: "mini", style: "minimal", occasion: "diario" },
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
