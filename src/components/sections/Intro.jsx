import { useEffect, useState, useRef, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiArrowRight } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { profile, socials } from "../../data";
import "./Intro.css";

const SOCIAL_ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  leetcode: SiLeetcode,
};

// Calculate responsive avatar & card geometry for any viewport width (320px to 1440px+)
const calculateResponsiveGeometry = () => {
  if (typeof window === "undefined") {
    return { stage1Diameter: 340, cardDiameter: 150, stage1Scale: 2.27, centerOffset: 215 };
  }
  const vw = window.innerWidth;
  const paddingEachSide = vw >= 768 ? 24 : vw >= 400 ? 16 : 12;
  const bannerW = Math.min(580, vw - paddingEachSide * 2);

  // Proportional card avatar diameter
  let cardD;
  if (vw >= 1024) cardD = 150;
  else if (vw >= 768) cardD = 130;
  else if (vw >= 430) cardD = 100;
  else if (vw >= 360) cardD = 88;
  else cardD = 80;

  // Proportional Stage 1 portrait diameter
  let stage1D;
  if (vw >= 1024) stage1D = Math.min(340, Math.max(280, vw * 0.24));
  else if (vw >= 768) stage1D = Math.min(280, Math.max(220, vw * 0.32));
  else stage1D = Math.min(220, Math.max(150, vw * 0.46));

  const scale = stage1D / cardD;
  const offset = Math.max(0, bannerW / 2 - cardD / 2);

  return {
    stage1Diameter: stage1D,
    cardDiameter: cardD,
    stage1Scale: scale,
    centerOffset: offset,
  };
};

const Intro = ({ onComplete, prefersReducedMotion = false }) => {
  // Stages: 'welcome' -> 'transform' -> 'card' -> 'exit'
  const [stage, setStage] = useState(() => (prefersReducedMotion ? "card" : "welcome"));
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Responsive coordinates to center portrait in Stage 1 and land smoothly on left of card
  const [dimensions, setDimensions] = useState(calculateResponsiveGeometry);

  const stageTimersRef = useRef([]);
  const progressIntervalRef = useRef(null);

  const addTimer = useCallback((callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    stageTimersRef.current.push(timer);
    return timer;
  }, []);

  const clearAllTimers = useCallback(() => {
    stageTimersRef.current.forEach((t) => window.clearTimeout(t));
    stageTimersRef.current = [];
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
  }, []);

  const handleFinish = useCallback(() => {
    clearAllTimers();
    setStage("exit");
    addTimer(() => {
      onComplete?.();
    }, 450);
  }, [clearAllTimers, addTimer, onComplete]);

  // Global Escape key listener for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFinish]);

  // Dynamically calculate responsive typography so "JIT MONDAL" occupies ~90-94% of viewport width
  useEffect(() => {
    const updateFitTypography = () => {
      const viewportWidth = window.innerWidth;
      const targetWidth = viewportWidth * 0.92;

      let emWidth = 10.54;
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.font = '800 100px "Syne", "Plus Jakarta Sans", sans-serif';
          const measured = ctx.measureText(profile.name || "JIT MONDAL").width;
          if (measured > 0) {
            emWidth = measured / 100 + 0.09;
          }
        }
      } catch {
        // Fallback to calibrated ratio
      }

      const calculatedFontSize = targetWidth / emWidth;
      const maxByHeight = (window.innerHeight * 0.78) / 5 / 0.88;
      const finalFontSize = Math.min(calculatedFontSize, maxByHeight);

      document.documentElement.style.setProperty(
        "--intro-fit-font-size",
        `${finalFontSize.toFixed(2)}px`
      );
    };

    updateFitTypography();

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateFitTypography);
    }

    const handleResizeOrOrientation = () => {
      updateFitTypography();
    };

    window.addEventListener("resize", handleResizeOrOrientation);
    window.addEventListener("orientationchange", handleResizeOrOrientation);
    return () => {
      window.removeEventListener("resize", handleResizeOrOrientation);
      window.removeEventListener("orientationchange", handleResizeOrOrientation);
      document.documentElement.style.removeProperty("--intro-fit-font-size");
    };
  }, []);

  // Update card & avatar geometry on viewport resize or mobile orientation change
  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateResponsiveGeometry());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Motion choreography sequence matching reference
  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    // Stage 1: Full-Screen Welcome Typography & Center Portrait (0ms - 2200ms)
    addTimer(() => {
      // Stage 2: Typography fades, portrait glides to left, bar grows out from circle
      setStage("transform");
    }, 2200);

    addTimer(() => {
      // Stage 4: Card is fully in place, progress auto-advance starts
      setStage("card");
    }, 3150);

    return () => clearAllTimers();
  }, [prefersReducedMotion, addTimer, clearAllTimers]);

  // Stage 4: Auto-advance countdown with hover pause
  useEffect(() => {
    if (stage !== "card") return undefined;

    const totalDuration = 4800; // 4.8 seconds to read profile card
    const stepInterval = 40;
    let elapsed = 0;

    progressIntervalRef.current = window.setInterval(() => {
      if (!isPaused) {
        elapsed += stepInterval;
        setProgress(Math.min(100, (elapsed / totalDuration) * 100));

        if (elapsed >= totalDuration) {
          window.clearInterval(progressIntervalRef.current);
          handleFinish();
        }
      }
    }, stepInterval);

    return () => {
      if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
    };
  }, [stage, isPaused, handleFinish]);

  const isCardVisible = stage === "transform" || stage === "card";

  return (
    <Motion.aside
      className="intro-portal"
      role="region"
      aria-label="Profile introduction"
      initial={{ opacity: 0 }}
      animate={{
        opacity: stage === "exit" ? 0 : 1,
        scale: stage === "exit" ? 1.04 : 1,
        filter: stage === "exit" ? "blur(8px)" : "blur(0px)",
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        pointerEvents: stage === "exit" ? "none" : "auto",
      }}
    >
      {/* Ambient Lighting & Atmosphere */}
      <div className="intro-ambient-glow" aria-hidden="true" />

      {/* Top Utility Bar: Monogram Badge & Skip Button */}
      <header className="intro-top-bar">
        <div className="intro-badge-indicator" aria-hidden="true">
          <span className="intro-badge-dot" />
          <span>{profile.monogram} // INTRO</span>
        </div>

        <button
          type="button"
          className="intro-skip-btn"
          onClick={handleFinish}
          aria-label="Skip introduction and proceed to portfolio"
        >
          <span>Skip Intro</span>
          <span className="key-hint" aria-hidden="true">[Esc]</span>
        </button>
      </header>

      {/* Main Center Cinematic Stage */}
      <div className="intro-stage-center">
        {/* STAGE 1 & 2: 5-Row Editorial Typography Grid (JIT MONDAL never cropped) */}
        <AnimatePresence>
          {stage === "welcome" && (
            <Motion.div
              className="intro-typography-canvas"
              aria-hidden="true"
              initial={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              <div className="intro-type-row row-outer-top">
                <span>{profile.name}</span>
              </div>
              <div className="intro-type-row row-inner-top">
                <span>{profile.name}</span>
              </div>
              <div className="intro-type-row row-center-hero">
                <span>{profile.name}</span>
              </div>
              <div className="intro-type-row row-inner-bottom">
                <span>{profile.name}</span>
              </div>
              <div className="intro-type-row row-outer-bottom">
                <span>{profile.name}</span>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* HERO BANNER: Single Continuous Portrait transforming into the Profile Card */}
        <div className="intro-card-stage-wrap">
          <article
            className="intro-editorial-banner"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* The Continuous Circular Portrait (Stage 1 Centered -> Stage 4 Left of Card) */}
            <Motion.div
              className="intro-banner-avatar-wrap"
              initial={false}
              animate={{
                x: stage === "welcome" ? dimensions.centerOffset : 0,
                scale: stage === "welcome" ? dimensions.stage1Scale : 1,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="intro-banner-avatar">
                <img
                  src={profile.portrait || "/j-pic.jpeg"}
                  alt={profile.name}
                  fetchPriority="high"
                  onError={(e) => {
                    e.currentTarget.src = "/j-pic.jpeg";
                  }}
                />

                {/* Seamless White Outline Text passing across the circular portrait in Stage 1 */}
                <AnimatePresence>
                  {stage === "welcome" && (
                    <Motion.div
                      className="intro-portrait-text-cutout"
                      aria-hidden="true"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.25 } }}
                      style={{
                        transform: `translate(-50%, -50%) scale(${1 / dimensions.stage1Scale})`,
                      }}
                    >
                      <span>{profile.name}</span>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Motion.div>

            {/* Information Bar Growing Horizontally Out from Behind the Portrait */}
            <Motion.div
              className="intro-banner-card"
              initial={false}
              animate={{
                scaleX: isCardVisible ? 1 : 0,
                opacity: isCardVisible ? 1 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.68,
                delay: prefersReducedMotion ? 0 : 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                transformOrigin: "left center",
                pointerEvents: stage === "card" ? "auto" : "none",
              }}
            >
              <div className="intro-banner-inner">
                {/* Top Name & Role from data */}
                <Motion.header
                  className="intro-banner-top"
                  initial={false}
                  animate={{
                    opacity: isCardVisible ? 1 : 0,
                    x: isCardVisible ? 0 : -14,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.45,
                    delay: prefersReducedMotion ? 0 : 0.62,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <h2 className="intro-banner-name">{profile.name}</h2>
                  <p className="intro-banner-role">{profile.role}</p>
                </Motion.header>

                {/* Horizontal Divider Line with subtle progress fill */}
                <Motion.div
                  className="intro-banner-divider-wrap"
                  aria-hidden="true"
                  initial={false}
                  animate={{
                    scaleX: isCardVisible ? 1 : 0,
                    opacity: isCardVisible ? 1 : 0,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.45,
                    delay: prefersReducedMotion ? 0 : 0.72,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: "left center" }}
                >
                  {!prefersReducedMotion && (
                    <div
                      className="intro-banner-divider-fill"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </Motion.div>

                {/* Bottom Action Row: Pill Button + Social Icons */}
                <Motion.footer
                  className="intro-banner-bottom"
                  initial={false}
                  animate={{
                    opacity: isCardVisible ? 1 : 0,
                    y: isCardVisible ? 0 : 8,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.45,
                    delay: prefersReducedMotion ? 0 : 0.82,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button
                    type="button"
                    className="intro-banner-pill-btn"
                    onClick={handleFinish}
                    aria-label="Explore Portfolio"
                  >
                    <span>Explore Portfolio</span>
                    <FiArrowRight aria-hidden="true" style={{ fontSize: "0.85em" }} />
                  </button>

                  <div className="intro-banner-socials" aria-label="Social Profiles">
                    {socials.map(({ label, href, id }) => {
                      const Icon = SOCIAL_ICONS[id] || FiGithub;
                      return (
                        <a
                          key={id}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${profile.name}'s ${label}`}
                          title={label}
                          className="intro-banner-icon-btn"
                        >
                          <Icon aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                </Motion.footer>
              </div>
            </Motion.div>
          </article>
        </div>
      </div>
    </Motion.aside>
  );
};

export default Intro;
