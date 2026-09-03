/**
 * Datos del configurador "Personalización".
 *
 * - BASE_BAGS: los 3 dibujos base del proveedor, ya recortados a PNG con fondo
 *   transparente en /public/personaliza. Se recolorean por CSS (capa de color
 *   con mask-image + el dibujo en mix-blend-multiply encima).
 * - YARNS: la carta de colores de trapillo. El color elegido es el color de la
 *   bolsa completa.
 * - ACCESSORIES: complementos que se dibujan sobre la bolsa. `anchor` apunta a
 *   un punto de amarre definido por cada modelo (coordenadas en % del escenario,
 *   que tiene la misma proporción que el PNG del modelo).
 *
 * Para migrar a CMS: reemplazar estas constantes por un fetch y conservar la
 * forma de los tipos.
 */

export type YarnColor = {
  id: string;
  name: string;
  /** color principal del hilo (= color de la bolsa) */
  hex: string;
  /** tono para el aro/etiqueta y para complementos a juego */
  shade: string;
};

export type BagAnchor = "handleL" | "handleR" | "handleTop" | "ringL" | "ringR" | "body" | "side";

export type BaseBag = {
  id: string;
  name: string;
  /** descripción corta del tejido/forma */
  note: string;
  img: string;
  /** proporción del dibujo (ancho / alto) para que el escenario calce exacto */
  ratio: number;
  /** puntos de amarre en % del escenario [x, y] */
  anchors: Record<BagAnchor, [number, number]>;
};

export type AccessorySlot = "handle" | "ringL" | "ringR" | "bodyUpper" | "shoulder";

export type Accessory = {
  id: string;
  name: string;
  hint: string;
  slot: AccessorySlot;
  /** de qué color se dibuja: 'yarn' sigue el hilo elegido, 'gold'/'silver' metal */
  tint: "yarn" | "gold" | "silver" | "bloom";
};

export const BASE_BAGS: BaseBag[] = [
  {
    id: "arena",
    name: "Arena",
    note: "Tote de punto calado, asas largas trenzadas.",
    img: "/personaliza/arena.png",
    ratio: 920 / 920,
    anchors: {
      handleL: [34, 9],
      handleR: [64, 9],
      handleTop: [49, 5],
      ringL: [16, 44],
      ringR: [85, 44],
      body: [50, 66],
      side: [86, 60],
    },
  },
  {
    id: "dalia",
    name: "Dalia",
    note: "Bolsa con solapa trenzada y broche triangular.",
    img: "/personaliza/dalia.png",
    ratio: 920 / 1150,
    anchors: {
      handleL: [33, 24],
      handleR: [66, 24],
      handleTop: [49, 12],
      ringL: [12, 40],
      ringR: [88, 40],
      body: [50, 60],
      side: [90, 52],
    },
  },
  {
    id: "sol",
    name: "Sol",
    note: "Hobo de punto grueso en relieve, asa redonda.",
    img: "/personaliza/sol.png",
    ratio: 920 / 1150,
    anchors: {
      handleL: [24, 46],
      handleR: [66, 41],
      handleTop: [45, 6],
      ringL: [23, 47],
      ringR: [67, 43],
      body: [45, 72],
      side: [80, 64],
    },
  },
];

export const YARNS: YarnColor[] = [
  { id: "crudo", name: "Crudo", hex: "#EFE6D6", shade: "#C9BBA1" },
  { id: "arena", name: "Arena", hex: "#DAC4A0", shade: "#AC9A6E" },
  { id: "camel", name: "Camel", hex: "#C69C6D", shade: "#946B41" },
  { id: "tabaco", name: "Tabaco", hex: "#9A6B3F", shade: "#6C4826" },
  { id: "terracota", name: "Terracota", hex: "#C4613C", shade: "#8E3F23" },
  { id: "coral", name: "Coral", hex: "#FF6B4A", shade: "#C4402A" },
  { id: "cereza", name: "Cereza", hex: "#C6303B", shade: "#8C1D26" },
  { id: "rosa-palo", name: "Rosa palo", hex: "#E7A9B7", shade: "#BB7F8E" },
  { id: "fucsia", name: "Fucsia", hex: "#FF7FB0", shade: "#CB5586" },
  { id: "lavanda", name: "Lavanda", hex: "#B9A2E3", shade: "#8A73B7" },
  { id: "uva", name: "Uva", hex: "#8B46D9", shade: "#5E2C9A" },
  { id: "indigo", name: "Índigo", hex: "#35407A", shade: "#232C58" },
  { id: "cielo", name: "Cielo", hex: "#7FB5D6", shade: "#54879F" },
  { id: "turquesa", name: "Turquesa", hex: "#17C4C4", shade: "#0E8E8E" },
  { id: "jade", name: "Jade", hex: "#3FA787", shade: "#2A7860" },
  { id: "oliva", name: "Oliva", hex: "#7E7A3C", shade: "#565425" },
  { id: "mostaza", name: "Mostaza", hex: "#E7A81F", shade: "#B07C12" },
  { id: "sol", name: "Sol", hex: "#FFC13B", shade: "#C88E1E" },
  { id: "perla", name: "Gris perla", hex: "#B7B9B3", shade: "#8C8E88" },
  { id: "grafito", name: "Grafito", hex: "#4A4A52", shade: "#2E2E34" },
  { id: "negro", name: "Negro", hex: "#26262B", shade: "#141417" },
];

export const ACCESSORIES: Accessory[] = [
  { id: "pompon", name: "Pompón de hilo", hint: "Colgado del asa, a juego con la bolsa.", slot: "handle", tint: "yarn" },
  { id: "borla", name: "Borla larga", hint: "Fleco tejido en un aro lateral.", slot: "ringR", tint: "yarn" },
  { id: "mosqueton", name: "Mosquetón dorado", hint: "Herraje metálico con argolla.", slot: "ringL", tint: "gold" },
  { id: "flor", name: "Dije de flor", hint: "Charm esmaltado de colores.", slot: "bodyUpper", tint: "bloom" },
  { id: "bandolera", name: "Correa bandolera", hint: "Asa larga cruzada, mismo hilo.", slot: "shoulder", tint: "yarn" },
];
