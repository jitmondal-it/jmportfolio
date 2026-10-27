import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/TProjects";
import Skills from "../components/sections/Skills";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Projects />
      <Skills />
      <About />
      <Contact />
    </>
  );
};

export default Home;
