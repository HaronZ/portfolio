import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <footer className="contact" id="contact">
      <Reveal>
        <p className="kicker">Contact</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="contact-title">
          Let’s build something
          <br />
          great together<span className="dot">.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="contact-actions">
          <a className="btn" href="mailto:haronzie19@gmail.com">
            Say hello
          </a>
          <a className="btn btn-ghost" href="mailto:haronzie19@gmail.com">
            haronzie19@gmail.com
          </a>
        </div>
      </Reveal>
      <p className="footer-note">
        © 2026 Haronzie — designed &amp; built by hand with Next.js.
      </p>
    </footer>
  );
}
