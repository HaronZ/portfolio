"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // progress 0 → 1 while the hero scrolls out of view
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -46]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <header className="hero" id="top" ref={ref}>
      <div className="hero-glow" aria-hidden="true" />
      <motion.div className="hero-inner" style={{ opacity, scale, y }}>
        <p className="hero-kicker">Hello, I’m</p>
        <h1 className="hero-title">Haronzie</h1>
        <p className="hero-sub">
          I design &amp; build apps that feel <em>effortless</em>.
        </p>
      </motion.div>
      <motion.div
        className="scroll-cue"
        style={{ opacity: cueOpacity }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <span className="chevron" />
      </motion.div>
    </header>
  );
}
