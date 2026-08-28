"use client";

import { useEffect, useRef } from "react";

/**
 * Campo de tejido procedural en GLSL (§26 "WebGL si aporta valor"): hilos que
 * se entrelazan en trama sencilla, con deriva lenta y respuesta al scroll.
 * WebGL crudo (sin Three.js) para mantenerlo ligero. Fallback: degradado CSS.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;

// paleta TRAPILLO — alegre
const vec3 IVORY = vec3(1.000, 0.976, 0.949); // #FFF9F2
const vec3 SAND  = vec3(1.000, 0.757, 0.231); // sol #FFC13B
const vec3 CLAY  = vec3(1.000, 0.420, 0.290); // coral #FF6B4A
const vec3 COCOA = vec3(0.545, 0.275, 0.851); // uva #8B46D9

float thread(float x, float w) {
  float d = abs(fract(x) - 0.5);
  return smoothstep(w, w - 0.06, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  float aspect = uRes.x / uRes.y;
  uv.x *= aspect;

  float zoom = mix(9.0, 14.0, uProgress);
  vec2 g = uv * zoom + vec2(uTime * 0.03, uTime * 0.015);
  g += uPointer * 0.5;

  vec2 cell = floor(g);
  vec2 f = fract(g);
  float over = mod(cell.x + cell.y, 2.0); // 1 = trama encima, 0 = urdimbre encima

  // sombreado tubular de cada hilo
  float warp = thread(g.x, 0.42);
  float weft = thread(g.y, 0.42);
  float warpShade = sin(f.x * 3.14159);
  float weftShade = sin(f.y * 3.14159);

  vec3 col = IVORY;
  float shadow = 0.0;

  if (over > 0.5) {
    col = mix(col, SAND, weft);
    col = mix(col, CLAY, weft * (1.0 - weftShade) * 0.7);
    col = mix(col, SAND, warp * 0.35);
    shadow = warp * (1.0 - warpShade) * 0.4;
  } else {
    col = mix(col, SAND, warp);
    col = mix(col, CLAY, warp * (1.0 - warpShade) * 0.7);
    col = mix(col, SAND, weft * 0.35);
    shadow = weft * (1.0 - weftShade) * 0.4;
  }

  col = mix(col, COCOA, shadow);

  // luz cálida difusa desde arriba-izquierda
  float light = 1.0 - length(uv / vec2(aspect, 1.0) - vec2(0.32, 0.28)) * 0.5;
  col *= mix(0.72, 1.12, clamp(light, 0.0, 1.0));

  // grano
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function WeaveShader({
  className,
  progressRef,
}: {
  className?: string;
  /** 0..1, normalmente el progreso de scroll de la sección */
  progressRef?: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fallback = () => {
      canvas.style.background =
        "linear-gradient(135deg, #FFC13B, #FF6B4A 45%, #8B46D9)";
    };

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl || gl.isContextLost()) {
      fallback();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("WeaveShader compile:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      fallback();
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("WeaveShader link:", gl.getProgramInfoLog(prog));
      fallback();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uProgress = gl.getUniformLocation(prog, "uProgress");
    const uPointer = gl.getUniformLocation(prog, "uPointer");

    let raf = 0;
    let running = true;
    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) loop(performance.now());
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const start = performance.now();
    const loop = (now: number) => {
      if (!running || gl.isContextLost()) return;
      resize();
      const t = reduced ? 0 : (now - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uProgress, progressRef?.current ?? 0);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    loop(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      // No forzamos loseContext(): en StrictMode/remount el <canvas> reutiliza
      // el mismo contexto y quedaría inservible. El GC lo libera con el canvas.
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
