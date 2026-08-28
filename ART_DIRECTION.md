# TRAPILLO — Dirección de Arte & Sistema de Experiencia

> Documento base (regla #40 del brief). Define arte, estructura, sistema de
> animación, vínculos con el scroll, transiciones, jerarquía visual y estrategia
> mobile **antes** de implementar.

---

## 1. La marca

**Nombre:** TRAPILLO
_Trapillo_ es el hilo grueso de algodón reciclado con el que se tejen a mano
bolsos y cestos. El nombre es el material y el material es la historia.

**Tagline:** _Del hilo a tu bolsa._
**Frase de identidad:** _No seguimos tendencias. Creamos piezas que permanecen._
**Voz:** serena, artesanal, precisa. Habla poco. Nunca grita. Nunca usa signos de
exclamación. Escribe como una etiqueta cosida a mano.

**Manifiesto (uso editorial, fragmentos):**
- Hecho a tu medida.
- Todo comienza con un hilo.
- Cada hilo cuenta una historia. La próxima puede ser la tuya.

Toda la copy y la config viven en `src/lib/site.ts` — cambiar la marca es editar
un archivo.

---

## 2. Concepto rector — "DEL HILO A TU BOLSA"

Un **único hilo** recorre toda la página de arriba a abajo. Es:
- el hilo conductor narrativo (literal),
- el elemento de transición entre escenas,
- el sistema de navegación secundario (su avance = progreso de scroll),
- el gesto de marca en el loader y en el cierre (dibuja el logotipo).

Implementación: un `<path>` SVG global fijo a viewport (`ConductorThread.tsx`)
cuyo `stroke-dashoffset` se controla con el progreso de scroll vía GSAP
ScrollTrigger. Segmentos del path se anclan a las secciones.

El usuario debe sentir que **sigue físicamente ese hilo**.

---

## 3. Paleta — alegre (v2)

Fuente única: `src/app/globals.css :root` + espejo en `tailwind.config.ts`.

| Token   | Hex       | Uso |
|---------|-----------|-----|
| `ivory` | `#FFF9F2` | Fondo base — blanco cálido |
| `cream` | `#FFE9D6` | Fondo alterno de sección — durazno |
| `linen` | `#FCE1D0` | Superficies, tarjetas — melocotón pálido |
| `sand`  | `#FFC44D` | Dorado — acento secundario, hilo claro |
| `clay`  | `#FF6B4A` | **Coral** — acento principal, hover, hilo, CTA |
| `cocoa` | `#8B46D9` | **Uva** — acento secundario, texto de apoyo |
| `walnut`| `#5A2A9E` | Uva profunda — titulares display, fondo Artesanía |
| `ink`   | `#241640` | Índigo profundo — texto principal, escenas oscuras |
| `ash`   | `#7E6F9A` | Lila-gris — texto tenue |
| `sun` `sea` `rose` | `#FFC13B` `#17C4C4` `#FF7FB0` | Acentos rotativos (hilo conductor, mapa, texturas) |

Colores vivos pero en sinergia: coral + uva + sol + durazno, sobre papel cálido.
El hilo conductor y el del footer son **degradados** coral→sol→turquesa→uva.
La luz sigue siendo cálida; grain sutil permanente (`mix-blend: multiply`, ~5%).

---

## 4. Tipografía

- **Serif — Fraunces** (opsz variable). Titulares, frases editoriales,
  storytelling. Se usa grande, con `optical-sizing` alto, tracking ligeramente
  negativo en tamaños display. Cursiva para los momentos emocionales.
- **Sans — Inter**. Navegación, precios, botones, fichas de producto, UI.
  Tracking `0.18em` en mayúsculas para etiquetas (`text-editorial`).

Escala display (clamp, fluida):
`--step-6: clamp(3rem, 9vw, 8.5rem)` para las frases a pantalla completa.

Reglas: máximo una idea por pantalla en la parte narrativa. El texto nunca
compite con el movimiento; entra cuando el movimiento se calma.

---

## 5. Estructura del sitio

```
/                     Experiencia cinemática completa (una sola página, 12 escenas)
/coleccion            Grid funcional, filtros, todos los modelos
/producto/[slug]      Ficha individual con visual grande y "hilo → carrito"
/historia             Versión larga y navegable del relato artesanal
/contacto             Contacto + ubicación con tratamiento de marca
/carrito              Carrito a página completa (además del drawer lateral)
```

Datos de producto: `src/lib/products.ts` con el esquema del brief (§36), listo
para sustituir por Shopify / Woo / Stripe / Supabase / Sanity sin tocar UI.

### Escenas de la home (orden = storyboard §37)

| # | Escena | Sección | Mecánica de scroll |
|---|--------|---------|--------------------|
| 0 | Loading | `LoadingScreen` | Hilo dibuja el wordmark (stroke-dashoffset), luego "ENTRANDO…", cortina sube |
| 1 | Hero | `Hero` + `HeroCanvas` | Canvas 2D: bola de estambre cae con gravedad + rebote, desenrolla rastro de hilo. Pinned. Parallax de cámara al iniciar scroll |
| 2 | Hecho a tu medida | `MadeToMeasure` | Frase: fade + blur + tracking-in, deriva vertical mínima, sale al seguir |
| 3 | Todo comienza con un hilo | `ThreadBeginning` | Pinned. 5 estados morphing: HILO → PATRÓN → TEJIDO → FORMA → BOLSA, atados a `scrub` |
| 4 | Artesanía | `Craft` | Macro-texturas (SVG turbulence + CSS). Zoom cinematográfico, parallax por capa, grain |
| 5 | Bolsas flotantes | `FloatingBags` | Pinned. Modelos entran alternando izq/der/centro/fondo; rotación, escala, Z, vaivén. Parallax + tilt con mouse |
| 6 | Fondo: tejiendo | capa dentro de 4/5 | Capa `-z` con manos/patrones desenfocados, velocidad de parallax propia |
| 7 | Identidad | `BrandIdentity` | Tipografía enorme. "No seguimos tendencias." → "Creamos piezas que permanecen." Escala con scroll, fondo tonal |
| 8 | Encuentra tu bolsa | `Finder` | Configurador: tamaño / color / estilo / ocasión. La silueta SVG se actualiza en vivo |
| 9 | Colección destacada | `FeaturedCollection` | E-commerce claro pero con microinteracciones. Add-to-cart dispara "hilo → carrito" |
| 10| Cierre | `Finale` | El hilo reconecta productos y forma el logo. "Cada hilo cuenta una historia." CTA |
| 11| Contacto | `Contact` | Entradas escalonadas. WhatsApp / Instagram / Email / Teléfono / Horario |
| 12| Ubicación | `LocationMap` | Mapa SVG estilizado: entra desenfocado → enfoca con scroll. "VISÍTANOS". Parallax |
| — | Footer | `Footer` | Extensión de la experiencia. El hilo lo atraviesa y remata en el logo |

Persistentes: `Navbar` (transparente → sólida con blur según scroll), `HomeButton`
(esquina, discreto, scroll suave al top), `CustomCursor`, `CartDrawer`.

---

## 6. Sistema de animación

**Motores:**
- **Lenis** — smooth scroll con inercia ligera (`lerp 0.1`), integrado al ticker de GSAP.
- **GSAP + ScrollTrigger** — toda animación ligada a scroll. `scrub` para lo
  sincronizado, `toggleActions` para reveals puntuales. `pin` en escenas 1, 3, 5.
- **Canvas 2D** — hero (física de la bola + rastro), partículas de fibra.
- **CSS 3D transforms** — bolsas flotantes, tilt, profundidad de capas.
- **SVG** — hilo conductor, siluetas de bolsa, mapa, logo.

**Principios de timing:**
- Easing global: `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-cinema`). Nada lineal salvo scrubs.
- Reveals: `y: 24 → 0`, `opacity 0 → 1`, `filter: blur(8px) → 0`, 0.9–1.2s, stagger 0.08.
- Nada "rebota" de forma infantil; el único rebote es físico (la bola en el hero).

**Jerarquía de parallax (§15):**
| Capa | Velocidad relativa |
|------|--------------------|
| Fondo / ambiente | 0.15–0.3 |
| Proceso artesanal | 0.4–0.6 |
| Hilo conductor | 0.7 |
| Producto | 0.9–1.1 |
| Texto | ~1.0 (mínimo desplazamiento propio) |

**Cursor:** círculo de 12px (mix-blend-difference). Crece a 64px sobre elementos
interactivos y muestra "VER" / "EXPLORAR" / "ARRASTRA". Se oculta en touch.

**Microinteracciones:** botones magnéticos + línea inferior que se dibuja; hover
de producto = tilt + acercar + subir luz; add-to-cart = clon del producto viaja
por una curva bézier hasta el icono del carrito y el contador late.

---

## 7. Transiciones entre secciones (§26)

Nunca cortes. Repertorio: el hilo cruza y "cose" la siguiente escena; máscaras
`clip-path` que se abren; `scale` + `blur` cruzados; cambio tonal de fondo
animado con scrub. Cada sección comparte 1 elemento con la siguiente (el hilo, un
color, una textura) para encadenar.

---

## 8. Estrategia mobile (§32) — v2: mismos scrollytellings que en escritorio

Decisión del cliente: **todas las escenas ancladas y con scrub corren igual en
móvil**. No se degradan a reveals. Solo se ajustan magnitudes.

| Aspecto | Desktop | Mobile |
|---------|---------|--------|
| Smooth scroll | Lenis completo | Lenis, `lerp` mayor, `syncTouch` off, `ScrollTrigger.config({ ignoreMobileResize: true })` |
| Hero | Canvas físico + DOF, pin + scrub | Igual (canvas con menos sub-steps / partículas en low-power) |
| Escena "hilo→bolsa" | Pin + 5 estados morphing | **Igual** |
| Artesanía | Visual sticky lateral + crossfade | **Igual** — visual sticky en banda superior, texto corre por detrás |
| Bolsas flotantes | Órbita 3D pinned + tilt de ratón | **Igual** — parade 3D pinned, magnitudes ×0.62, sin tilt (solo `pointer: fine`) |
| Identidad | Pin + escala + viraje de fondo | **Igual** |
| Navegación | Enlaces en la navbar | Menú hamburguesa (`Navbar.tsx`) |
| Cursor | Personalizado | Nativo (custom oculto en touch / <1024px) |
| Tipografía display | hasta 9rem | `clamp` desde 2.7rem |

`prefers-reduced-motion`: se desactivan scrubs, pins y canvas; todo se resuelve a
su estado final con fades cortos. El storytelling permanece: el hilo se dibuja
igual, solo que sin scrub.

---

## 9. Performance (§33)

- `next/dynamic` + `IntersectionObserver` para montar cada escena pesada solo
  cerca del viewport; canvas se pausa fuera de vista.
- Visuales 100% procedurales (SVG / Canvas / CSS) → sin descargas de imágenes,
  sin dependencias externas, nítido en cualquier densidad de pantalla.
- `will-change` puntual, `transform`/`opacity` únicamente, capa GPU controlada.
- `content-visibility: auto` en secciones no críticas.
- Detección de equipos débiles (`navigator.hardwareConcurrency`, `deviceMemory`) →
  baja densidad de partículas y desactiva blur.
- Objetivo: LCP < 2.5s, sin CLS, 60fps en scroll (desktop) / 30–60fps (mobile).

---

## 10. Orden de implementación

1. ✅ Dirección de arte (este doc)
2. ✅ Config + design system (tokens, tipografía, grain, cursor)
3. ✅ Providers: SmoothScroll (Lenis+GSAP), Cart (context + localStorage)
4. ✅ Chrome persistente: Navbar, HomeButton, CustomCursor, CartDrawer
5. ✅ LoadingScreen (hilo → wordmark)
6. ✅ Hero + HeroCanvas (física de la bola + rastro)
7. ✅ ConductorThread (hilo global ligado a scroll)
8. ✅ Escenas narrativas: MadeToMeasure, ThreadBeginning, Craft
9. ✅ FloatingBags + capa de fondo tejiendo
10. ✅ BrandIdentity, Finder, FeaturedCollection, Finale
11. ✅ Contact, LocationMap, Footer
12. ✅ Rutas: /coleccion, /producto/[slug], /historia, /contacto, /carrito
13. ⏳ Siguiente iteración: Three.js/R3F para visor 3D real de producto, shaders
   GLSL para el tejido, secuencia horizontal en Artesanía, CMS real.
