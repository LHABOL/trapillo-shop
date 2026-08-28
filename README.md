# TRAPILLO

Experiencia e-commerce cinemática para una marca de bolsas tejidas en trapillo.
_Del hilo a tu bolsa._

Sitio de una sola narrativa: la home cuenta el proceso de creación de una bolsa
siguiendo un hilo que recorre toda la página y termina formando el logotipo.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Estilos | Tailwind CSS 3 + tokens propios |
| Animación scroll | GSAP + ScrollTrigger |
| Smooth scroll | Lenis (integrado al ticker de GSAP) |
| Hero | Canvas 2D — física de la bola de estambre + rastro de hilo |
| 3D | Three.js + React Three Fiber + drei — visor de producto (`Bag3D`), carga diferida solo en desktop capaz |
| Shaders | GLSL / WebGL crudo — campo de tejido animado en la sección de Artesanía (`WeaveShader`) |
| Transiciones de ruta | `app/template.tsx` — cortina con el hilo entre páginas |
| Visuales | 100% procedurales (SVG / Canvas / GLSL / geometría 3D) — sin imágenes externas |
| Datos | `src/lib/products.ts` — esquema listo para Shopify/Woo/Stripe/Supabase/Sanity |

> La dirección de arte completa (paleta, tipografía, sistema de animación,
> storyboard de scroll, plan mobile, performance) está en
> [`ART_DIRECTION.md`](./ART_DIRECTION.md).

## Empezar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node ≥ 18.18.

## Rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Experiencia cinemática completa (12 escenas + loader) |
| `/coleccion` | Grid funcional con filtros por categoría |
| `/producto/[slug]` | Ficha individual + "comprar ahora" + relacionados |
| `/historia` | Versión larga y navegable del relato artesanal |
| `/contacto` | Contacto + mapa estilizado con parallax |
| `/carrito` | Carrito a página completa (además del drawer lateral) |

## Estructura

```
src/
  app/                 rutas (App Router)
  components/
    providers/         SmoothScroll (Lenis+GSAP), Cart (context + localStorage)
    ui/                Navbar, HomeButton, CustomCursor, CartDrawer, Reveal, Magnetic, Wordmark
    sections/          las 12 escenas de la home + Footer
    products/          ProductCard, ProductDetail, CollectionGrid, AddToCartButton
    visuals/           BagSilhouette, MacroTexture (procedurales)
  lib/                 site (config marca), products (datos), types, gsap, hooks, flyToCart
```

## Cambiar la marca

Todo el texto, contacto, envío y navegación viven en
[`src/lib/site.ts`](./src/lib/site.ts). El wordmark es SVG en
[`src/components/ui/Wordmark.tsx`](./src/components/ui/Wordmark.tsx).

## Conectar productos reales

Reimplementa `getAllProducts` / `getProductBySlug` / `getFeaturedProducts` en
`src/lib/products.ts` contra tu backend (pueden ser `async`). El resto de la UI
ya consume esas funciones y el tipo `Product`.

## Accesibilidad y performance

- `prefers-reduced-motion`: desactiva scrubs, pins y canvas; resuelve todo a su
  estado final.
- Detección de equipos con pocos recursos → baja densidad de partículas y blur.
- Canvas del hero se pausa cuando sale del viewport.
- Cursor propio solo en punteros finos y ≥1024px.

## Hecho en la iteración 2

- Visor 3D de producto (`components/visuals/Bag3D.tsx`) con geometría y
  texturas de tejido generadas en runtime (`lib/knitTexture.ts`). Se carga solo
  en desktop con WebGL; cae a la silueta SVG en el resto (`ProductStage`).
- Shader GLSL del tejido (`components/visuals/WeaveShader.tsx`) de fondo en
  Artesanía, ligado al progreso de scroll. Fallback: degradado CSS.
- Transición de ruta con el hilo (`app/template.tsx`).

## Siguiente iteración (pendiente)

- Afinar materiales/iluminación del 3D y modelar asas por silueta con más detalle.
- Scroll horizontal en la sección de artesanía.
- Pasarela de pago real (Stripe / Mercado Pago) y CMS.
- Pase de QA en dispositivos reales (el 3D y los shaders necesitan pantalla).
