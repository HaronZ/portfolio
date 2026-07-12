export default function Nav() {
  return (
    <nav className="nav">
      <a className="nav-brand" href="#top">
        Haronzie<span className="dot">.</span>
      </a>
      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact" className="nav-cta">
          Contact
        </a>
      </div>
    </nav>
  );
}
