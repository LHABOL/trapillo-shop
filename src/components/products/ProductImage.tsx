import Image from "next/image";
import type { Product } from "@/lib/types";
import { BagSilhouette } from "@/components/visuals/BagSilhouette";

type Props = {
  product: Product;
  /** índice de la imagen a mostrar */
  index?: number;
  /** valor de `sizes` para next/image */
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Fotografía real del producto (next/image, object-cover). Si el producto aún
 * no tiene foto, cae a la silueta procedural.
 */
export function ProductImage({
  product,
  index = 0,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
  priority,
}: Props) {
  const image = product.images[index] ?? product.images[0];

  if (!image) {
    return (
      <BagSilhouette
        silhouette={product.silhouette}
        weave={product.weave}
        colorHex={product.colors[0]?.hex}
        shadeHex={product.colors[0]?.shade}
        className={className}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
