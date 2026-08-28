import * as THREE from "three";
import type { Product } from "@/lib/types";

type Maps = {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
};

/**
 * Genera de forma procedural las texturas del tejido para un material PBR:
 * color (map), relieve (normalMap) y micro-brillo (roughnessMap). Sin assets.
 */
export function makeKnitTextures(
  weave: Product["weave"],
  colorHex: string,
  shadeHex: string,
  size = 512,
): Maps {
  const stitch =
    weave === "espiga" ? 20 : weave === "calada" ? 30 : weave === "punto-alto" ? 34 : 24;

  const color = document.createElement("canvas");
  const normal = document.createElement("canvas");
  const rough = document.createElement("canvas");
  for (const c of [color, normal, rough]) {
    c.width = c.height = size;
  }
  const cx = color.getContext("2d")!;
  const nx = normal.getContext("2d")!;
  const rx = rough.getContext("2d")!;

  // base
  cx.fillStyle = colorHex;
  cx.fillRect(0, 0, size, size);
  nx.fillStyle = "#8080ff"; // normal neutro
  nx.fillRect(0, 0, size, size);
  rx.fillStyle = "#b8b8b8";
  rx.fillRect(0, 0, size, size);

  const drawStitch = (x: number, y: number, w: number, h: number, up: boolean) => {
    // color: "V" de punto
    cx.strokeStyle = shadeHex;
    cx.lineWidth = Math.max(2, w * 0.16);
    cx.lineCap = "round";
    cx.beginPath();
    if (up) {
      cx.moveTo(x, y + h);
      cx.quadraticCurveTo(x + w / 2, y - h * 0.2, x + w, y + h);
    } else {
      cx.moveTo(x, y);
      cx.quadraticCurveTo(x + w / 2, y + h * 1.2, x + w, y);
    }
    cx.stroke();

    // normal: lóbulo claro/oscuro para dar volumen al punto
    const g = nx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "#a0a0ff");
    g.addColorStop(0.5, "#8080ff");
    g.addColorStop(1, "#6060c0");
    nx.fillStyle = g;
    nx.beginPath();
    nx.ellipse(x + w / 2, y + h / 2, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
    nx.fill();

    // roughness: los hilos brillan un poco más en el centro
    rx.fillStyle = "rgba(150,150,150,0.5)";
    rx.beginPath();
    rx.ellipse(x + w / 2, y + h / 2, w * 0.42, h * 0.32, 0, 0, Math.PI * 2);
    rx.fill();
  };

  let row = 0;
  for (let y = -stitch; y < size + stitch; y += stitch * 0.8) {
    const offset = row % 2 ? stitch / 2 : 0;
    for (let x = -stitch; x < size + stitch; x += stitch) {
      drawStitch(x + offset, y, stitch, stitch, (row + Math.round(x / stitch)) % 2 === 0);
    }
    row++;
  }

  if (weave === "calada") {
    // agujeros del tejido calado
    cx.globalCompositeOperation = "destination-out";
    for (let y = stitch; y < size; y += stitch * 1.6) {
      for (let x = stitch; x < size; x += stitch * 1.6) {
        cx.beginPath();
        cx.arc(x, y, stitch * 0.28, 0, Math.PI * 2);
        cx.fill();
      }
    }
    cx.globalCompositeOperation = "source-over";
  }

  const mk = (canvas: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    t.anisotropy = 4;
    return t;
  };

  const map = mk(color);
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = mk(normal);
  const roughnessMap = mk(rough);

  return {
    map,
    normalMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}
