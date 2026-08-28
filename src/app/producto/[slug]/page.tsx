import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { formatMXN } from "@/lib/site";
import { ProductDetail } from "@/components/products/ProductDetail";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: `${product.shortDescription} ${formatMXN(product.price)}.`,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);
  const fallback = getAllProducts().filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetail product={product} related={related.length ? related : fallback} />;
}
