import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ParticleScrub from "@/components/ParticleScrub";
import Statement from "@/components/Statement";
import WorkGallery from "@/components/WorkGallery";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ParticleScrub />
      <Statement />
      <WorkGallery />
      <About />
      <Contact />
    </>
  );
}
