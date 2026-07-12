"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "motion/react";

const TEXT =
  "Every pixel earns its place. I build fast, fluid products for mobile and web — obsessing over the details people feel but never see.";

function Word({
  children,
  progress,
  range,
  reduce,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }}>
      {children}{" "}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="statement" ref={ref}>
      <div className="statement-sticky">
        <p className="statement-text">
          {words.map((word, i) => {
            const start = (i / words.length) * 0.92;
            const end = start + 0.92 / words.length;
            return (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[start, end]}
                reduce={reduce}
              >
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
