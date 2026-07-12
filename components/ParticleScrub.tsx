"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/*
 * The "Apple" section: a 420vh-tall section pins a canvas, and scroll
 * progress scrubs a particle animation — DESIGN → sphere → BUILD.
 */

type Pt = { x: number; y: number; z: number };

const COLORS = [
  "#f5f5f7", "#f5f5f7", "#f5f5f7", "#f5f5f7", "#f5f5f7", "#f5f5f7",
  "#2997ff", "#2997ff", "#bf5af2", "#64d2ff",
];

// scroll timeline: which shapes blend at progress p
const SEGMENTS = [
  { from: 0.0, to: 0.18, a: "A", b: "A" },
  { from: 0.18, to: 0.42, a: "A", b: "S" },
  { from: 0.42, to: 0.58, a: "S", b: "S" },
  { from: 0.58, to: 0.82, a: "S", b: "B" },
  { from: 0.82, to: 1.01, a: "B", b: "B" },
];

const CAPTIONS = [
  "It starts with intent.",
  "Ideas take shape.",
  "Then I make them real.",
];

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function sampleText(word: string, count: number, w: number, h: number): Pt[] {
  const off = document.createElement("canvas");
  off.width = Math.max(2, Math.floor(w));
  off.height = Math.max(2, Math.floor(h));
  const c = off.getContext("2d", { willReadFrequently: true })!;
  let size = h * 0.42;
  const fontFor = (s: number) =>
    `800 ${s}px Inter, -apple-system, "Segoe UI", Roboto, sans-serif`;
  c.font = fontFor(size);
  const tw = c.measureText(word).width;
  if (tw > w * 0.92) {
    size *= (w * 0.92) / tw;
    c.font = fontFor(size);
  }
  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(word, off.width / 2, off.height / 2);

  const data = c.getImageData(0, 0, off.width, off.height).data;
  const pts: Pt[] = [];
  const step = 3;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      if (data[(y * off.width + x) * 4 + 3] > 128) {
        pts.push({ x: x - off.width / 2, y: y - off.height / 2, z: 0 });
      }
    }
  }
  if (!pts.length) pts.push({ x: 0, y: 0, z: 0 });
  const out: Pt[] = new Array(count);
  for (let i = 0; i < count; i++)
    out[i] = pts[Math.floor((i * pts.length) / count)];
  return out;
}

function buildSphere(count: number): Pt[] {
  const pts: Pt[] = new Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = count > 1 ? 1 - (i / (count - 1)) * 2 : 0;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    pts[i] = { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
  }
  return pts;
}

export default function ParticleScrub() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // caption fade windows along the scrub timeline
  const cap0 = useTransform(scrollYProgress, [0, 0.09, 0.18], [0, 1, 0]);
  const cap1 = useTransform(scrollYProgress, [0.41, 0.5, 0.59], [0, 1, 0]);
  const cap2 = useTransform(scrollYProgress, [0.82, 0.91, 1], [0, 1, 0]);
  const capOpacity = [cap0, cap1, cap2];

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, COUNT = 0, sphereR = 0;
    let particles: { x: number; y: number; color: string; phase: number }[] = [];
    let shapeA: Pt[] = [], shapeB: Pt[] = [], fib: Pt[] = [];

    const spherePoint = (i: number, t: number, p: number): Pt => {
      const b = fib[i];
      const tilt = 0.42;
      const y1 = b.y * Math.cos(tilt) - b.z * Math.sin(tilt);
      const z1 = b.y * Math.sin(tilt) + b.z * Math.cos(tilt);
      const a = t * 0.00035 + p * 3.5;
      const cos = Math.cos(a), sin = Math.sin(a);
      return {
        x: (b.x * cos + z1 * sin) * sphereR,
        y: y1 * sphereR,
        z: (-b.x * sin + z1 * cos) * sphereR,
      };
    };

    const shapePoint = (kind: string, i: number, t: number, p: number): Pt =>
      kind === "A" ? shapeA[i] : kind === "B" ? shapeB[i] : spherePoint(i, t, p);

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      COUNT = clamp(Math.floor((W * H) / 900), 900, 2200);
      sphereR = Math.min(W, H) * 0.3;
      fib = buildSphere(COUNT);
      shapeA = sampleText("DESIGN", COUNT, W * 0.92, H * 0.6);
      shapeB = sampleText("BUILD", COUNT, W * 0.92, H * 0.6);

      if (particles.length !== COUNT) {
        particles = new Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
          particles[i] = {
            x: (Math.random() - 0.5) * W,
            y: (Math.random() - 0.5) * H,
            color: COLORS[i % COLORS.length],
            phase: Math.random() * Math.PI * 2,
          };
        }
      }
    };

    const draw = (p: number, t: number) => {
      ctx.clearRect(0, 0, W, H);
      const fadeIn = clamp(p * 25, 0.15, 1);

      let seg = SEGMENTS[0];
      for (const s of SEGMENTS) {
        if (p >= s.from && p < s.to) { seg = s; break; }
        if (p >= s.to) seg = s;
      }
      const u = seg.to > seg.from
        ? ease(clamp((p - seg.from) / (seg.to - seg.from), 0, 1))
        : 0;

      const cx = W / 2, cy = H / 2;
      const fov = 900;

      for (let i = 0; i < COUNT; i++) {
        const pt = particles[i];
        const A = shapePoint(seg.a, i, t, p);
        const B = shapePoint(seg.b, i, t, p);
        const tx = lerp(A.x, B.x, u);
        const ty = lerp(A.y, B.y, u);
        const tz = lerp(A.z, B.z, u);

        // particles chase their target — organic formation + smooth morphs
        pt.x = lerp(pt.x, tx, 0.16);
        pt.y = lerp(pt.y, ty, 0.16);

        const persp = fov / (fov + tz);
        const wob = Math.sin(t * 0.0012 + pt.phase) * 1.4;

        ctx.globalAlpha = fadeIn * clamp(0.25 + 0.75 * persp, 0, 1);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(
          cx + (pt.x + wob) * persp,
          cy + (pt.y + wob * 0.6) * persp,
          1.5 * persp,
          0,
          6.2832
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    setup();
    let raf = 0;
    let smoothP = 0;

    if (reduced) {
      // static fallback: settle the particles into the sphere once
      for (let k = 0; k < 40; k++) draw(0.5, 0);
    } else {
      const loop = (t: number) => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          smoothP = lerp(smoothP, scrollYProgress.get(), 0.12);
          draw(smoothP, t);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setup();
        if (reduced) for (let k = 0; k < 40; k++) draw(0.5, 0);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, [scrollYProgress]);

  return (
    <section className="scrub" ref={sectionRef} aria-label="Animated intro">
      <div className="scrub-sticky">
        <canvas ref={canvasRef} />
        {CAPTIONS.map((caption, i) => (
          <motion.p
            key={caption}
            className="scrub-caption"
            style={{ opacity: capOpacity[i] }}
          >
            {caption}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
