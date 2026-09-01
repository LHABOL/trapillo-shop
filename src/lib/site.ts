/**
 * Configuración única de marca. Cambiar el nombre por otra marca = editar aquí.
 */
export const site = {
  name: "Gaby Arévalo",
  /** monograma corto para espacios reducidos */
  short: "GA",
  tagline: "Del hilo a tu bolsa.",
  /** placa metálica con el logotipo (esquina superior derecha) */
  logo: "/brand/logo-plate.jpg",
  domain: "gabyarevalo.mx",
  description:
    "Bolsas tejidas a mano en trapillo de algodón. Hecho a mano con amor.",
  manifesto: {
    measure: "Hecho a tu medida.",
    beginning: "Todo comienza con un hilo.",
    identityA: "No seguimos tendencias.",
    identityB: "Creamos piezas que permanecen.",
    finaleA: "Cada hilo cuenta una historia.",
    finaleB: "La próxima puede ser la tuya.",
  },
  contact: {
    whatsapp: { label: "+52 55 1234 5678", href: "https://wa.me/525512345678" },
    instagram: {
      label: "@hechoamanoconamor_ga",
      href: "https://www.instagram.com/hechoamanoconamor_ga/",
    },
    email: { label: "hola@gabyarevalo.mx", href: "mailto:hola@gabyarevalo.mx" },
    phone: { label: "55 1234 5678", href: "tel:+525512345678" },
    hours: "Lun a Vie · 10:00 – 19:00 · Sáb · 11:00 – 15:00",
    location: {
      line1: "Taller Gaby Arévalo",
      line2: "Colonia Roma Norte, Ciudad de México",
      // coordenadas aproximadas Roma Norte, solo para el mapa estilizado
      lat: 19.4185,
      lng: -99.1605,
      mapsHref: "https://maps.google.com/?q=Roma+Norte+Ciudad+de+Mexico",
    },
  },
  shipping: {
    /** centavos MXN */
    flatRate: 15000,
    freeThreshold: 150000,
    copy: "Envío nacional. Gratis desde $1,500.",
  },
  nav: [
    { label: "Colección", href: "/coleccion" },
    { label: "Historia", href: "/historia" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export function formatMXN(cents: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
