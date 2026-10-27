import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiFolder,
  FiCpu,
  FiMail,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { profile } from "../../data/profile";

const navItems = [
  { label: "Home", href: "#home", icon: FiHome },
  { label: "About", href: "#about", icon: FiUser },
  { label: "Projects", href: "#projects", icon: FiFolder },
  { label: "Skills", href: "#skills", icon: FiCpu },
  { label: "Contact", href: "#contact", icon: FiMail },
];

const SiteHeader = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectsRoute = location.pathname === "/projects";
  const isAboutRoute = location.pathname === "/about";
  const [homeActive, setHomeActive] = useState("#home");
  const active = isProjectsRoute ? "#projects" : isAboutRoute ? "#about" : homeActive;
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isManualScroll = useRef(false);
  const scrollTimer = useRef(null);

  // Accurate active section calculation based on viewport bounds
  const getActiveSection = () => {
    if (window.scrollY < 100) {
      return "#home";
    }

    // If near the bottom of the page, activate contact
    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollBottom < 80) {
      return "#contact";
    }

    const sectionIds = ["home", "projects", "skills", "about", "contact"];
    const focalLine = 220; // 220px below top edge, underneath floating navbar

    // Direct match: which section contains the focal line
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= focalLine && rect.bottom > focalLine) {
        return `#${id}`;
      }
    }

    // Fallback match: section closest to focal line
    let closestId = null;
    let minDistance = Infinity;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.top - focalLine);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = `#${id}`;
      }
    }

    return closestId || "#home";
  };

  useEffect(() => {
    if (isProjectsRoute || isAboutRoute) {
      return;
    }

    const handleScroll = () => {
      // If user recently clicked a nav item, lock the bubble to target
      if (isManualScroll.current) return;

      const currentActive = getActiveSection();
      if (currentActive) {
        setHomeActive(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [isProjectsRoute, isAboutRoute]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);

    if (location.pathname !== "/") {
      if (href === "#projects" && isProjectsRoute) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (href === "#about" && isAboutRoute) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      navigate(`/${href}`);
      return;
    }

    // Lock active bubble to clicked item to prevent mid-scroll jumping
    setHomeActive(href);
    isManualScroll.current = true;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    // Release lock after smooth scroll animation settles
    scrollTimer.current = setTimeout(() => {
      isManualScroll.current = false;
      const currentActive = getActiveSection();
      if (currentActive) {
        setHomeActive(currentActive);
      }
    }, 850);
  };

  return (
    <header className="liquid-nav-wrapper">
      {/* SVG Gooey Filter for Liquid Surface Physics */}
      <svg className="liquid-svg-filter" aria-hidden="true">
        <defs>
          <filter id="liquid-goo-blend">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Main Liquid Floating Capsule */}
      <nav className="liquid-navbar-dock" aria-label="Main Navigation">
        {/* Top Organic Specular Light Refraction */}
        <div className="liquid-specular-highlight" aria-hidden="true" />

        {/* Ambient Liquid Internal Glow */}
        <div className="liquid-ambient-aura" aria-hidden="true" />

        {/* Left: Brand / Monogram & Name */}
        <a
          href="#home"
          className={`liquid-brand-btn ${active === "#home" ? "active" : ""}`}
          onClick={(e) => handleNavClick(e, "#home")}
          aria-label="Home Overview"
          title="Home"
        >
          <span className="brand-icon-box">
            <span className="brand-monogram">{profile.monogram || "JM"}</span>
            <span className="brand-liquid-pip" aria-hidden="true" />
          </span>
          <span className="brand-name">{profile.name}</span>
        </a>

        {/* Center: Desktop Liquid Nav Items with Morphing Indicator */}
        <div
          className="liquid-desktop-tabs"
          onMouseLeave={() => setHoveredTab(null)}
          role="menubar"
        >
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = active === href;
            const isHovered = hoveredTab === href;

            return (
              <a
                key={href}
                href={href}
                role="menuitem"
                className={`liquid-nav-link ${isActive ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, href)}
                onMouseEnter={() => setHoveredTab(href)}
              >
                {/* Elastic Liquid Morphing Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="liquid-active-pill"
                    className="liquid-active-pill"
                    transition={{
                      type: "spring",
                      stiffness: 440,
                      damping: 32,
                      mass: 0.75,
                    }}
                  >
                    <div className="liquid-pill-inner-glow" />
                    <div className="liquid-pill-lens" />
                  </motion.div>
                )}

                {/* Fluid Water Hover Backdrop */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="liquid-hover-pill"
                    className="liquid-hover-pill"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  />
                )}

                {/* Icon + Label Content */}
                <span className="liquid-link-inner">
                  <Icon className="liquid-nav-icon" aria-hidden="true" />
                  <span className="liquid-nav-text">{label}</span>
                </span>

                {/* Liquid Floating Droplet Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="liquid-active-droplet"
                    className="liquid-active-droplet"
                    transition={{
                      type: "spring",
                      stiffness: 480,
                      damping: 28,
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right: Liquid Action Controls (Theme Toggle + Mobile Hamburger) */}
        <div className="liquid-controls-cluster">
          {/* Liquid Theme Switcher */}
          <button
            type="button"
            className="liquid-control-btn theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -70, scale: 0.65, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 70, scale: 0.65, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className="control-icon-wrapper"
            >
              {theme === "dark" ? (
                <FiSun className="liquid-control-icon sun" />
              ) : (
                <FiMoon className="liquid-control-icon moon" />
              )}
            </motion.div>
          </button>

          {/* Mobile Liquid Menu Toggle */}
          <button
            type="button"
            className="liquid-control-btn mobile-menu-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="control-icon-wrapper"
            >
              {mobileOpen ? (
                <FiX className="liquid-control-icon" />
              ) : (
                <FiMenu className="liquid-control-icon" />
              )}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Liquid Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="liquid-mobile-drawer"
            initial={{ opacity: 0, y: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="liquid-mobile-inner">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = active === href;
                return (
                  <a
                    key={href}
                    href={href}
                    className={`liquid-mobile-item ${isActive ? "active" : ""}`}
                    onClick={(e) => handleNavClick(e, href)}
                  >
                    <Icon className="mobile-item-icon" />
                    <span className="mobile-item-label">{label}</span>
                    {isActive && (
                      <span className="mobile-liquid-pip" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
