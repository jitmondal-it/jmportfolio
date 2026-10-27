import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import SiteHeader from "./components/layout/SiteHeader";
import Footer from "./components/layout/Footer";
import Intro from "./components/sections/Intro";
import AIChatBot from "./components/chatbot/AIChatBot";
import usePrefersReducedMotion from "./hooks/usePrefersReducedMotion";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const App = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    // Direct navigation to specific section or subroute should not be blocked
    if (window.location.hash || window.location.pathname !== "/") {
      return false;
    }
    // Run once per browser session
    const hasSeen = sessionStorage.getItem("hasSeenIntro");
    return !hasSeen;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setShowIntro(false);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <div className="page-wrap">
      <ScrollToTop />

      <a className="skip-link" href="#home">
        Skip to content
      </a>

      {showIntro && (
        <Intro
          onComplete={handleIntroComplete}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      <SiteHeader theme={theme} toggleTheme={toggleTheme} />

      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
};

export default App;
