import { useState } from "react";
import { FiCheck, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { SiLeetcode } from "react-icons/si";
import { profile, socials } from "../../data";

const ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
  leetcode: SiLeetcode,
};

const HeroCard = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="uiverse-card-wrapper">
      <div className="uiverse-card">
        {/* Top-Right Mail Action */}
        <button
          type="button"
          className="uiverse-mail-btn"
          onClick={copyEmail}
          title={copied ? "Email copied!" : "Copy email address"}
          aria-label="Copy email address"
        >
          {copied ? (
            <FiCheck className="mail-icon copied" aria-hidden="true" />
          ) : (
            <FiMail className="mail-icon" aria-hidden="true" />
          )}
        </button>

        {/* Profile Picture with Hover Morphing */}
        <div className="uiverse-profile-pic">
          <img
            src={profile.portrait || "/j-pic.jpeg"}
            alt={profile.name}
            width={340}
            height={340}
            fetchPriority="high"
            onError={(e) => {
              e.currentTarget.src = "/j-pic.jpeg";
            }}
          />
        </div>

        {/* Sliding Bottom Drawer */}
        <div className="uiverse-bottom">
          <div className="uiverse-content">
            <span className="uiverse-name">{profile.name}</span>
            <span className="uiverse-role">{profile.role}</span>
            <p className="uiverse-about-me">
              I build scalable backend systems, secure REST APIs, and modern web
              applications. Passionate about microservices, real-time
              communication, and AI-powered solutions.
            </p>
          </div>

          <div className="uiverse-bottom-bar">
            {/* Social Icons: GitHub · LinkedIn · LeetCode */}
            <div className="uiverse-social-links">
              {socials.map(({ label, href, id }) => {
                const Icon = ICONS[id] || FiGithub;
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="uiverse-social-icon"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>

            {/* Contact Me CTA */}
            <a
              href="#contact"
              onClick={scrollToContact}
              className="uiverse-contact-btn"
              id="hero-card-contact-btn"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
