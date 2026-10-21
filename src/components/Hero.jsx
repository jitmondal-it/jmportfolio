import { useState } from "react";
import { FiArrowRight, FiDownload, FiMapPin } from "react-icons/fi";
import { profile } from "../content/site";
import HeroCard from "./HeroCard";
import SocialLinks from "./SocialLinks";

const Hero = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-monolith-grid">
        {/* Primary Stage: Identity & Command */}
        <div className="hero-command-stage">
          {/* Status & Location Strip */}
          <div className="hero-status-strip">
            <span className="status-indicator">
              <span className="status-ping-dot" />
              <span className="status-text">{profile.availability}</span>
            </span>
            <span className="status-divider" aria-hidden="true">/</span>
            <span className="location-chip">
              <FiMapPin className="location-icon" aria-hidden="true" />
              <span>{profile.location}</span>
            </span>
          </div>

          {/* Role Kicker */}
          <div className="hero-role-kicker">{profile.role}</div>

          {/* Name Title */}
          <h1 className="hero-name-title">
            Hey, I'm <span className="hero-name-highlight">{profile.name}</span>
          </h1>

          {/* Headline Statement from site.js */}
          <p className="hero-tagline-statement">{profile.headline}</p>


          {/* Action Rail & Socials */}
          <div className="hero-actions-hub">
            <div className="hero-cta-group">
              <a href="#projects" className="btn-hero-primary" id="hero-projects-cta">
                <span>View Projects</span>
                <FiArrowRight className="btn-icon-right" aria-hidden="true" />
              </a>

              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="btn-hero-secondary"
                id="hero-resume-cta"
              >
                <FiDownload className="btn-icon-left" aria-hidden="true" />
                <span>Resume</span>
              </a>
            </div>

            <div className="hero-social-dock">
              <SocialLinks showEmail={true} onCopyEmail={copyEmail} copied={copied} />
            </div>
          </div>
        </div>

        {/* Visual Stage: Interactive Morphing Card & Stats Showcase */}
        <div className="hero-visual-stage">
          <div className="hero-visual-container">
            <HeroCard />

            {/* Authentic Stats HUD from site.js */}
            {profile.stats && profile.stats.length > 0 && (
              <div className="hero-stats-matrix">
                {profile.stats.map((stat) => (
                  <div key={stat.label} className="stat-matrix-cell">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;