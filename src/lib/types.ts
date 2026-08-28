export type ColorOption = {
  name: string;
  /** hex principal del hilo */
  hex: string;
  /** hex secundario para el tejido / sombra */
  shade: string;
};

export type ProductCategory = "tote" | "cesto" | "clutch" | "mochila" | "playa";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** precio en centavos MXN para evitar flotantes */
  price: number;
  currency: "MXN";
  shortDescription: string;
  description: string;
  /** claves de silueta procedural — ver BagSilhouette */
  silhouette: "tote" | "bucket" | "clutch" | "backpack" | "market";
  weave: "calada" | "cerrada" | "espiga" | "punto-alto";
  colors: ColorOption[];
  materials: string[];
  dimensions: { width: number; height: number; depth: number; unit: "cm" };
  availability: "in-stock" | "made-to-order" | "sold-out";
  category: ProductCategory;
  featured?: boolean;
  /** etiquetas para el configurador "Encuentra tu bolsa" */
  attributes: {
    size: "mini" | "media" | "grande";
    style: "minimal" | "clasica" | "statement";
    occasion: "diario" | "trabajo" | "playa" | "noche";
  };
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  silhouette: Product["silhouette"];
  colorHex: string;
}
