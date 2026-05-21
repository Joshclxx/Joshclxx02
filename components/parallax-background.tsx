"use client";

import { useEffect, useRef } from "react";

// ── Types ───────────────────────────────────────────────────────────────────
interface Star {
  x: number; y: number; z: number;   // 3D coords  (z: 0.1–1  far→near)
  ox: number; oy: number;             // original x/y for reset
  color: string;
  size: number;
}

interface Meteor {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string;
}

// ── Config ──────────────────────────────────────────────────────────────────
const FOV       = 300;   // perspective focal length
const DEPTH     = 800;   // z-space depth
const STAR_N    = 160;   // star count

const DARK_PALETTE  = ["#58a6ff", "#bc8cff", "#3fb950", "#79c0ff", "#d2a8ff", "#e6edf3"];
const LIGHT_PALETTE = ["#0969da", "#8250df", "#1a7f37", "#0550ae", "#6639ba", "#1f2328"];

// ── Helpers ─────────────────────────────────────────────────────────────────
function rand(min: number, max: number) { return min + Math.random() * (max - min); }

function makeStar(w: number, h: number, palette: string[]): Star {
  const x = rand(-w / 2, w / 2);
  const y = rand(-h / 2, h / 2);
  const z = rand(0.05, 1);
  return {
    x, y, z, ox: x, oy: y,
    color: palette[Math.floor(Math.random() * palette.length)],
    size: rand(0.4, 1.8),
  };
}

function makeMeteor(w: number, palette: string[]): Meteor {
  const angle = rand(-0.6, -0.3);
  const speed = rand(8, 14);
  return {
    x: rand(0, w), y: rand(0, 80),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed + speed * 0.4,
    life: 0,
    maxLife: rand(40, 70),
    color: palette[Math.floor(Math.random() * palette.length)],
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let animId = 0;
    let isDark = true;
    let palette = DARK_PALETTE;

    // Smooth state
    let scrollY = 0, targetScrollY = 0;
    let mouseX = 0, mouseY = 0, smoothMX = 0, smoothMY = 0;

    // Scene objects
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let meteorTimer = 0;

    // ── Init ──────────────────────────────────────────────────────────────
    const init = () => {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      stars = Array.from({ length: STAR_N }, () => makeStar(w, h, palette));
    };

    // ── Theme ─────────────────────────────────────────────────────────────
    const syncTheme = () => {
      isDark  = !document.documentElement.classList.contains("light");
      palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
      stars.forEach(s => { s.color = palette[Math.floor(Math.random() * palette.length)]; });
    };

    const themeObs = new MutationObserver(syncTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // ── Events ────────────────────────────────────────────────────────────
    const onScroll = () => { targetScrollY = window.scrollY; };
    const onMouse  = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", init);

    // ── Draw helpers ──────────────────────────────────────────────────────
    function toHex(alpha: number) {
      return Math.max(0, Math.min(255, Math.round(alpha * 255))).toString(16).padStart(2, "0");
    }

    function drawGlowDot(
      sx: number, sy: number, r: number,
      color: string, alpha: number
    ) {
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
      const hex2 = toHex(alpha);
      const hex1 = toHex(alpha * 0.35);
      grad.addColorStop(0,   color + hex2);
      grad.addColorStop(0.4, color + hex1);
      grad.addColorStop(1,   color + "00");
      ctx.beginPath();
      ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function drawMeteor(m: Meteor) {
      const progress = m.life / m.maxLife;
      const tailLen  = 60 * (1 - progress * 0.5);
      const alpha    = Math.max(0, Math.sin(progress * Math.PI)) * 0.8;
      const grad = ctx.createLinearGradient(
        m.x - m.vx * tailLen / 10, m.y - m.vy * tailLen / 10,
        m.x, m.y
      );
      grad.addColorStop(0, m.color + "00");
      grad.addColorStop(1, m.color + toHex(alpha));
      ctx.beginPath();
      ctx.moveTo(m.x - m.vx * tailLen / 10, m.y - m.vy * tailLen / 10);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    // ── Main loop ─────────────────────────────────────────────────────────
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Lerp smooth values
      scrollY  += (targetScrollY - scrollY)   * 0.05;
      smoothMX += (mouseX - smoothMX)         * 0.04;
      smoothMY += (mouseY - smoothMY)         * 0.04;

      // Camera tilt from mouse (subtle)
      const tiltX = (smoothMX / w - 0.5) * 20;
      const tiltY = (smoothMY / h - 0.5) * 14;

      ctx.clearRect(0, 0, w, h);

      // ── Stars ─────────────────────────────────────────────────────────
      // Group near stars for constellation lines (z > 0.6)
      const nearStars: Array<{ sx: number; sy: number; color: string }> = [];

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Fly-through: scroll moves camera along Z
        // Remap z with scroll offset, wrap around
        const zOffset   = (scrollY * 0.0003) % 1;
        const z         = ((s.z + zOffset) % 1) || 0.01;
        const scale     = FOV / (FOV + z * DEPTH);

        // Project to screen with mouse tilt
        const sx = cx + (s.ox + tiltX / scale) * scale;
        const sy = cy + (s.oy + tiltY / scale) * scale;

        const r      = s.size * scale * 3.5;
        const alpha  = Math.min(1, scale * 1.4) * (isDark ? 0.75 : 0.55);

        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

        drawGlowDot(sx, sy, r, s.color, alpha);

        if (z > 0.6) nearStars.push({ sx, sy, color: s.color });
      }

      // ── Constellation lines ───────────────────────────────────────────
      const MAX_DIST = 100;
      ctx.save();
      for (let i = 0; i < nearStars.length; i++) {
        for (let j = i + 1; j < nearStars.length; j++) {
          const a = nearStars[i], b = nearStars[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * (isDark ? 0.12 : 0.08);
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = a.color + toHex(alpha);
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // ── Meteors ───────────────────────────────────────────────────────
      meteorTimer++;
      if (meteorTimer > 220 && Math.random() < 0.015) {
        meteors.push(makeMeteor(w, palette));
        meteorTimer = 0;
      }

      meteors = meteors.filter(m => m.life < m.maxLife);
      for (const m of meteors) {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        drawMeteor(m);
      }

      animId = requestAnimationFrame(draw);
    };

    // ── Boot ──────────────────────────────────────────────────────────────
    syncTheme();
    init();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", init);
      themeObs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
