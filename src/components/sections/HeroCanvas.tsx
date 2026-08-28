"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };

/**
 * Escena del hero (§3): una bola de estambre cae sobre la mesa con física
 * creíble (gravedad + rebote amortiguado), rota y desenrolla un rastro de hilo.
 * Canvas 2D — sin dependencias. Se degrada en reduced-motion / low-power.
 */
export function HeroCanvas({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const strands = lowPower ? 5 : 9;
    const motionBlur = !reduced && !lowPower;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let tableY = 0;

    const R = 34;
    const ball = { x: 0, y: -80, vy: 0, vx: 0, rot: 0, vr: 0, rest: false };
    const trail: { x: number; y: number }[] = [];
    const gravity = 0.55;
    const restitution = 0.42;
    let settleT = 0;
    let raf = 0;
    let running = true;
    let started = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      tableY = H * 0.7;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ball.x = W * 0.5;
      if (!started) ball.y = -80;
    };

    const drawTable = () => {
      const g = ctx.createLinearGradient(0, tableY - 40, 0, H);
      g.addColorStop(0, "rgba(255,233,214,0)");
      g.addColorStop(0.25, "rgba(255,196,77,0.30)");
      g.addColorStop(1, "rgba(139,70,217,0.16)");
      ctx.fillStyle = g;
      ctx.fillRect(0, tableY - 40, W, H - tableY + 40);
      ctx.strokeStyle = "rgba(36,22,64,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, tableY);
      ctx.lineTo(W, tableY);
      ctx.stroke();
    };

    const drawShadow = () => {
      const drop = Math.max(0, Math.min(1, (ball.y - (tableY - R)) / 120 + 1));
      const sy = tableY + 4;
      const sx = ball.x;
      const spread = R * (1.5 - 0.5 * Math.abs(1 - drop));
      ctx.save();
      ctx.filter = "blur(6px)";
      ctx.fillStyle = `rgba(36,22,64,${0.2 * drop})`;
      ctx.beginPath();
      ctx.ellipse(sx, sy, spread, spread * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawTrail = () => {
      if (trail.length < 2) return;
      ctx.strokeStyle = "rgba(255,107,74,0.92)";
      ctx.lineWidth = 2.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        const p = trail[i];
        const prev = trail[i - 1];
        const mx = (p.x + prev.x) / 2;
        const my = (p.y + prev.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      ctx.stroke();
    };

    const drawBall = () => {
      ctx.save();
      ctx.translate(ball.x, ball.y);
      ctx.rotate(ball.rot);

      const grad = ctx.createRadialGradient(-R * 0.35, -R * 0.35, R * 0.2, 0, 0, R);
      grad.addColorStop(0, "#FF9E7A");
      grad.addColorStop(0.7, "#FF6B4A");
      grad.addColorStop(1, "#E8482C");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(36,22,64,0.45)";
      ctx.lineWidth = 1.4;
      for (let i = 0; i < strands; i++) {
        const a = (i / strands) * Math.PI;
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 0.92, R * 0.32, a, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255,249,242,0.42)";
      ctx.lineWidth = 1;
      for (let i = 0; i < strands; i++) {
        const a = (i / strands) * Math.PI + 0.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, R * 0.7, R * 0.5, a, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    const step = () => {
      if (!running) {
        raf = requestAnimationFrame(step);
        return;
      }

      if (motionBlur) {
        ctx.fillStyle = "rgba(255,249,242,0.34)";
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#FFF9F2";
        ctx.fillRect(0, 0, W, H);
      }

      drawTable();

      if (started) {
        // física
        ball.vy += gravity;
        ball.y += ball.vy;
        ball.x += ball.vx;
        ball.rot += ball.vr;
        ball.vr *= 0.985;

        if (ball.y + R >= tableY) {
          ball.y = tableY - R;
          if (Math.abs(ball.vy) > 1.2) {
            ball.vy *= -restitution;
            ball.vx += (Math.random() - 0.5) * 0.6;
            ball.vr += ball.vy * 0.01;
          } else {
            ball.vy = 0;
            ball.vx *= 0.8;
            ball.rest = true;
          }
        }

        // rastro: mientras cae/rueda deja hilo desde el punto de contacto
        if (!ball.rest) {
          trail.push({ x: ball.x, y: Math.min(ball.y + R, tableY) });
          if (trail.length > 260) trail.shift();
        } else {
          settleT += 1;
          // el hilo continúa dibujándose sobre la mesa (hand-off al hilo conductor)
          const last = trail[trail.length - 1] ?? { x: ball.x, y: tableY };
          const t = settleT * 0.045;
          const nx = ball.x + Math.cos(t) * (40 + settleT * 1.4);
          const ny = tableY + Math.sin(t * 1.7) * 10;
          if (nx < W + 60 && settleT % 2 === 0) {
            trail.push({ x: (last.x + nx) / 2, y: (last.y + ny) / 2 });
            if (trail.length > 520) trail.shift();
          }
          ball.rot += 0.004;
        }
      }

      drawShadow();
      drawTrail();
      drawBall();

      raf = requestAnimationFrame(step);
    };

    const onVisibility = (entries: IntersectionObserverEntry[]) => {
      const visible = entries[entries.length - 1]?.isIntersecting ?? true;
      // Nunca pausamos mientras la bola sigue cayendo o asentándose: así la
      // animación no se "pierde" si el IntersectionObserver arranca en falso.
      running = visible || !ball.rest;
    };
    const io = new IntersectionObserver(onVisibility, { threshold: 0.02 });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const beginFall = () => {
      if (started) return;
      started = true;
      running = true;
      trail.length = 0;
      settleT = 0;
      ball.x = W * 0.5;
      ball.y = -80;
      ball.vy = 0;
      ball.vx = 0;
      ball.rot = 0;
      ball.vr = 0.06;
      ball.rest = false;
      if (reduced) {
        ball.y = tableY - R;
        ball.rest = true;
      }
      // reanima el bucle por si el rAF quedó dormido durante la carga
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    // Arranca cuando el loading screen termina; si no llega la señal
    // (navegación directa, sin loader), arranca solo tras un tope.
    window.addEventListener("trapillo:enter", beginFall);
    const fallbackTimer = setTimeout(beginFall, reduced ? 0 : 6000);

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallbackTimer);
      window.removeEventListener("trapillo:enter", beginFall);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
