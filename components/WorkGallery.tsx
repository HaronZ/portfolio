"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { projects } from "@/lib/projects";

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const reduce = useReducedMotion() ?? false;

  // how far the track must slide left to show every card
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setShift(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -shift]);

  return (
    <section
      className="work"
      id="work"
      ref={sectionRef}
      style={shift > 0 ? { height: `calc(100vh + ${shift}px)` } : undefined}
    >
      <div className="work-sticky">
        <motion.div
          className="work-track"
          ref={trackRef}
          style={{ x: reduce ? 0 : x }}
        >
          <div className="work-intro">
            <p className="kicker">Selected Work</p>
            <h2>
              Things I’ve
              <br />
              built<span className="dot">.</span>
            </h2>
            <p className="work-hint">Keep scrolling →</p>
          </div>

          {projects.map((project) => {
            const inner = (
              <>
                <div className={`card-cover cover-${project.cover}`}>
                  {project.image ? (
                    <img
                      className="card-img"
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      style={
                        project.imagePosition
                          ? { objectPosition: project.imagePosition }
                          : undefined
                      }
                    />
                  ) : (
                    <span className="card-letter">{project.letter}</span>
                  )}
                </div>
                <div className="card-body">
                  <div className="chips">
                    {project.tags.map((tag) => (
                      <span className="chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3>
                    {project.title}
                    {project.href && <span className="card-arrow"> ↗</span>}
                  </h3>
                  <p>{project.blurb}</p>
                </div>
              </>
            );
            return project.href ? (
              <a
                className="card"
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {inner}
              </a>
            ) : (
              <article className="card" key={project.title}>
                {inner}
              </article>
            );
          })}

          <a className="card card-end" href="#contact">
            <div className="card-body card-end-body">
              <h3>
                Your project
                <br />
                could be next<span className="dot">.</span>
              </h3>
              <p>Let’s talk →</p>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
