import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/hero/Intro";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Nav } from "@/components/Nav";
import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { Statement } from "@/components/Statement";
import { Testimonials } from "@/components/Testimonials";
import { Work } from "@/components/work/Work";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SceneCanvas />
      <Intro />
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Work />
        <Capabilities />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <MotionProvider />
    </>
  );
}
