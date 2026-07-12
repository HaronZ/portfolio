import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <section className="about" id="about">
      <Reveal>
        <p className="kicker">About</p>
      </Reveal>
      <div className="about-grid">
        <Reveal className="about-bio">
          <h2>
            Developer with a designer’s eye<span className="dot">.</span>
          </h2>
          <p>
            I ship mobile apps with Flutter and Firebase, and web apps with
            modern TypeScript — from first sketch to production deploy. I care
            about motion, speed, and the little interactions that make software
            feel alive.
          </p>
        </Reveal>
        <div className="about-side">
          <Reveal delay={0.1}>
            <div className="stats">
              <div className="stat">
                <strong>4</strong>
                <span>projects shipped</span>
              </div>
              <div className="stat">
                <strong>2</strong>
                <span>platforms — mobile &amp; web</span>
              </div>
              <div className="stat">
                <strong>∞</strong>
                <span>attention to detail</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="chips">
              <span className="chip">Flutter</span>
              <span className="chip">Dart</span>
              <span className="chip">Firebase</span>
              <span className="chip">Supabase</span>
              <span className="chip">TypeScript</span>
              <span className="chip">React</span>
              <span className="chip">Next.js</span>
              <span className="chip">Node.js</span>
              <span className="chip">PostgreSQL</span>
              <span className="chip">Vercel</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
