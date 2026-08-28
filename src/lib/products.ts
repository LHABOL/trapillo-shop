import type { Product } from "./types";

/**
 * Fuente de datos temporal. El esquema (§36 del brief) está listo para
 * sustituirse por Shopify / WooCommerce / Stripe / Supabase / Sanity:
 * basta con reimplementar getAllProducts / getProductBySlug de forma async.
 *
 * Fotografía real en /public/products. Los precios siguen siendo provisionales.
 */

export const products: Product[] = [
  {
    id: "p01",
    slug: "modelo-01-luna",
    name: "Modelo 01 · Luna",
    price: 189000,
    currency: "MXN",
    shortDescription: "Tote de tejido calado en lila, asas largas.",
    description:
      "Un tote de cuerpo alto y tejido calado que deja pasar la luz. Las asas largas caen al hombro y la trama abierta mantiene la pieza ligera. Cada bolsa toma cerca de catorce horas de trabajo continuo.",
    images: [
      { src: "/products/luna-1.jpg", alt: "Tote de trapillo calado en lila colgando de la mano" },
      { src: "/products/luna-2.jpg", alt: "Tote de trapillo lila, vista del cuerpo del tejido" },
    ],
    silhouette: "tote",
    weave: "calada",
    colors: [{ name: "Lila", hex: "#9B6FB0", shade: "#6E4A85" }],
    materials: ["Trapillo de algodón reciclado", "Asas tejidas a juego"],
    dimensions: { width: 32, height: 34, depth: 12, unit: "cm" },
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
    shortDescription: "Cesto en bloque de color con cordón.",
    description:
      "Un cesto de cuerpo redondo tejido en bloque de color rosa y salvia, con cierre de cordón y asa larga para cruzar. Nace de una espiral que crece desde el centro de la base y se sostiene de pie sola.",
    images: [
      { src: "/products/duna-1.jpg", alt: "Cesto de trapillo rosa y verde salvia con asa cruzada" },
    ],
    silhouette: "bucket",
    weave: "cerrada",
    colors: [
      { name: "Rosa", hex: "#E3AEB4", shade: "#B98088" },
      { name: "Salvia", hex: "#7C8A6E", shade: "#586347" },
    ],
    materials: ["Trapillo de algodón reciclado", "Cordón de cierre a juego", "Alma de cuerda de yute"],
    dimensions: { width: 24, height: 22, depth: 24, unit: "cm" },
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
    shortDescription: "Bolsa de mano en palo de rosa, cadena con corazón.",
    description:
      "La pieza pequeña de la colección. Tejido cerrado y firme en palo de rosa, con un asa corta de cuentas doradas y un cierre de cadena rematado con un dije de corazón. Densa, deliberada, de noche.",
    images: [
      { src: "/products/brasa-1.jpg", alt: "Bolsa de mano de trapillo palo de rosa, vista frontal con cadena dorada" },
      { src: "/products/brasa-2.jpg", alt: "Bolsa de trapillo palo de rosa vista de lado con asa de cuentas" },
    ],
    silhouette: "clutch",
    weave: "espiga",
    colors: [{ name: "Palo de rosa", hex: "#A96B63", shade: "#7E4A44" }],
    materials: ["Trapillo de algodón mercerizado", "Asa de cuentas doradas", "Herraje y dije de latón"],
    dimensions: { width: 24, height: 18, depth: 8, unit: "cm" },
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
    shortDescription: "Bolsa amarilla de punto grueso, cadena desmontable.",
    description:
      "Punto grueso y lleno en amarillo, con asa superior tejida y una cadena dorada que se quita cuando la llevas en mano. Un color que se lleva todo el verano.",
    images: [
      { src: "/products/marea-1.jpg", alt: "Bolsa de trapillo amarilla con cadena dorada, vista frontal" },
      { src: "/products/marea-2.jpg", alt: "Bolsa de trapillo amarilla vista de lado" },
    ],
    silhouette: "market",
    weave: "punto-alto",
    colors: [{ name: "Amarillo", hex: "#E9C21C", shade: "#B8931A" }],
    materials: ["Trapillo de algodón reciclado", "Asa superior tejida", "Cadena de metal dorado desmontable"],
    dimensions: { width: 30, height: 24, depth: 14, unit: "cm" },
    availability: "in-stock",
    category: "playa",
    featured: true,
    attributes: { size: "media", style: "statement", occasion: "playa" },
  },
  {
    id: "p05",
    slug: "modelo-05-nido",
    name: "Modelo 05 · Nido",
    price: 238000,
    currency: "MXN",
    shortDescription: "Mochila de trapillo rosa con solapa de piel.",
    description:
      "Cuerpo de trapillo rosa con solapa de piel, cierre giratorio dorado y tirantes ajustables. Estructura firme que aguanta el día completo.",
    images: [
      { src: "/products/nido-1.jpg", alt: "Mochila de trapillo rosa con solapa de piel y cierre dorado" },
    ],
    silhouette: "backpack",
    weave: "cerrada",
    colors: [{ name: "Rosa", hex: "#E6B9C4", shade: "#C98FA0" }],
    materials: ["Trapillo de algodón", "Solapa y tirantes de piel", "Herraje giratorio de latón"],
    dimensions: { width: 26, height: 28, depth: 12, unit: "cm" },
    availability: "made-to-order",
    category: "mochila",
    featured: false,
    attributes: { size: "media", style: "clasica", occasion: "diario" },
  },
  {
    id: "p06",
    slug: "modelo-06-aire",
    name: "Modelo 06 · Aire",
    price: 96000,
    currency: "MXN",
    shortDescription: "Clutch de mano en azul petróleo.",
    description:
      "El gesto más pequeño de la colección. Tejido apretado sobre una estructura interna, en azul petróleo, con cierre metálico dorado. Entra lo esencial y nada más.",
    images: [
      { src: "/products/aire-1.jpg", alt: "Clutch de trapillo azul petróleo cerrado" },
      { src: "/products/aire-2.jpg", alt: "Clutch de trapillo azul petróleo abierto, cierre dorado" },
    ],
    silhouette: "clutch",
    weave: "cerrada",
    colors: [{ name: "Azul petróleo", hex: "#2E6C7E", shade: "#1E4C59" }],
    materials: ["Trapillo fino de algodón", "Estructura termoformada", "Cierre metálico dorado"],
    dimensions: { width: 22, height: 15, depth: 6, unit: "cm" },
    availability: "in-stock",
    category: "clutch",
    featured: false,
    attributes: { size: "mini", style: "minimal", occasion: "noche" },
  },
  {
    id: "p07",
    slug: "modelo-07-tierra",
    name: "Modelo 07 · Tierra",
    price: 196000,
    currency: "MXN",
    shortDescription: "Tote verde olivo con asa trenzada y borla.",
    description:
      "Tote en verde olivo de punto denso, con asa trenzada a tres cabos y una borla de piel en el cierre. Lleva la etiqueta metálica cosida a mano. El final es donde se nota el oficio.",
    images: [
      { src: "/products/tierra-1.jpg", alt: "Tote de trapillo verde olivo con borla de piel, vista frontal" },
      { src: "/products/tierra-2.jpg", alt: "Tote de trapillo verde olivo, vista en ángulo" },
    ],
    silhouette: "tote",
    weave: "cerrada",
    colors: [{ name: "Olivo", hex: "#5B5C3A", shade: "#3E3F26" }],
    materials: ["Trapillo de algodón reciclado", "Asa trenzada a tres cabos", "Borla de piel"],
    dimensions: { width: 30, height: 22, depth: 14, unit: "cm" },
    availability: "in-stock",
    category: "tote",
    featured: true,
    attributes: { size: "media", style: "clasica", occasion: "trabajo" },
  },
  {
    id: "p08",
    slug: "modelo-08-onix",
    name: "Modelo 08 · Ónix",
    price: 178000,
    currency: "MXN",
    shortDescription: "Hobo negro de punto muy grueso.",
    description:
      "Hobo negro de punto muy grueso, con forma envolvente que cae al hombro y una cadena corta rematada con un eslabón de media luna. Volumen sin peso.",
    images: [
      { src: "/products/onix-1.jpg", alt: "Bolsa hobo de trapillo negro de punto grueso, vista frontal" },
      { src: "/products/onix-2.jpg", alt: "Bolsa hobo de trapillo negro, vista de lado" },
    ],
    silhouette: "tote",
    weave: "punto-alto",
    colors: [{ name: "Negro", hex: "#2A2622", shade: "#16130F" }],
    materials: ["Trapillo grueso de algodón", "Cadena corta con eslabón de media luna"],
    dimensions: { width: 34, height: 26, depth: 12, unit: "cm" },
    availability: "in-stock",
    category: "tote",
    featured: true,
    attributes: { size: "grande", style: "minimal", occasion: "diario" },
  },
  {
    id: "p09",
    slug: "modelo-09-copa",
    name: "Modelo 09 · Copa",
    price: 224000,
    currency: "MXN",
    shortDescription: "Bolsa de solapa en cognac con borla y cadena.",
    description:
      "Bolsa de solapa en cognac, con trenzado a mano en la tapa, borla de ante y una cadena dorada para llevar cruzada. La pieza más vestida de la colección.",
    images: [
      { src: "/products/copa-1.jpg", alt: "Bolsa de solapa de trapillo cognac con borla, vista frontal" },
      { src: "/products/copa-2.jpg", alt: "Bolsa de solapa de trapillo cognac, vista de lado con cadena" },
    ],
    silhouette: "clutch",
    weave: "espiga",
    colors: [{ name: "Cognac", hex: "#8A5A34", shade: "#5E3B20" }],
    materials: ["Trapillo de algodón mercerizado", "Borla de ante", "Cadena de metal dorado", "Cierre triangular"],
    dimensions: { width: 24, height: 18, depth: 9, unit: "cm" },
    availability: "made-to-order",
    category: "clutch",
    featured: true,
    attributes: { size: "media", style: "statement", occasion: "noche" },
  },
  {
    id: "p10",
    slug: "modelo-10-sombra",
    name: "Modelo 10 · Sombra",
    price: 206000,
    currency: "MXN",
    shortDescription: "Hobo amplio verde olivo, asa acolchada.",
    description:
      "Hobo amplio en verde olivo, punto grueso y asa acolchada que reparte el peso. Cuerpo suave que se amolda a lo que llevas dentro.",
    images: [
      { src: "/products/sombra-1.jpg", alt: "Bolsa hobo amplia de trapillo verde olivo con asa acolchada" },
    ],
    silhouette: "tote",
    weave: "punto-alto",
    colors: [{ name: "Olivo", hex: "#5B5C3A", shade: "#3E3F26" }],
    materials: ["Trapillo grueso de algodón", "Asa acolchada tejida"],
    dimensions: { width: 36, height: 26, depth: 16, unit: "cm" },
    availability: "in-stock",
    category: "tote",
    featured: false,
    attributes: { size: "grande", style: "clasica", occasion: "diario" },
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
