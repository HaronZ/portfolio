import Reveal from "@/components/Reveal";
import CopyEmail from "@/components/CopyEmail";

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
          <a
            className="btn"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=haronzie19@gmail.com&su=Hello%20from%20your%20portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Say hello
          </a>
          <CopyEmail email="haronzie19@gmail.com" />
        </div>
      </Reveal>
      <p className="footer-note">
        © 2026 Haronzie — designed &amp; built by hand with Next.js.
      </p>
    </footer>
  );
}
