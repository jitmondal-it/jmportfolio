import React from "react";

/**
 * Modern 3D Floating Robot Mascot
 * Rendered using SVG with radial gradients, glossy specular reflections,
 * glowing animated LED eyes, and levitation floating physics.
 */
const Bot3D = ({ size = 64, className = "", isHovered = false }) => {
  return (
    <div
      className={`bot-3d-wrapper ${className}`}
      style={{ width: size, height: size * 1.15 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 138"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`bot-3d-svg ${isHovered ? "hovered" : ""}`}
      >
        <defs>
          {/* Head 3D Sphere Gradient */}
          <radialGradient
            id="botHeadGrad"
            cx="38%"
            cy="32%"
            r="65%"
            fx="35%"
            fy="28%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#C9ADA7" />
            <stop offset="60%" stopColor="#4A4E69" />
            <stop offset="100%" stopColor="#1e1e32" />
          </radialGradient>

          {/* Visor Glass Gradient */}
          <linearGradient id="botVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a14" />
            <stop offset="50%" stopColor="#141426" />
            <stop offset="100%" stopColor="#05050a" />
          </linearGradient>

          {/* Visor Specular Reflection */}
          <linearGradient id="botGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Torso 3D Gradient */}
          <radialGradient
            id="botBodyGrad"
            cx="40%"
            cy="35%"
            r="60%"
            fx="38%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#F2E9E4" />
            <stop offset="35%" stopColor="#C9ADA7" />
            <stop offset="75%" stopColor="#4A4E69" />
            <stop offset="100%" stopColor="#1a1a2b" />
          </radialGradient>

          {/* Metallic Ear Pod Gradient */}
          <linearGradient id="botMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2E9E4" />
            <stop offset="50%" stopColor="#9A8C98" />
            <stop offset="100%" stopColor="#22223B" />
          </linearGradient>

          {/* Glowing Neon Cyan for Eyes & Antenna */}
          <linearGradient id="botEyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Core Glow Filter */}
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drop Shadow Filter for Body */}
          <filter id="botDepthShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Floating Ambient Shadow Under Bot */}
        <ellipse
          cx="60"
          cy="130"
          rx="26"
          ry="6"
          fill="#000000"
          opacity="0.35"
          className="bot-ground-shadow"
        />

        {/* 3D Levitating Body Group */}
        <g className="bot-levitating-group">
          {/* Antenna */}
          <path
            d="M60 22V9"
            stroke="url(#botMetalGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Antenna Glowing Orb */}
          <circle
            cx="60"
            cy="7"
            r="5"
            fill="url(#botEyeGrad)"
            filter="url(#neonGlow)"
            className="bot-antenna-orb"
          />
          <circle cx="58.5" cy="5.5" r="1.5" fill="#ffffff" />

          {/* Ear Pods (Left & Right) */}
          <g>
            {/* Left Ear */}
            <rect
              x="14"
              y="40"
              width="8"
              height="20"
              rx="4"
              fill="url(#botMetalGrad)"
              filter="url(#botDepthShadow)"
            />
            <circle cx="18" cy="50" r="3" fill="#06b6d4" filter="url(#neonGlow)" />

            {/* Right Ear */}
            <rect
              x="98"
              y="40"
              width="8"
              height="20"
              rx="4"
              fill="url(#botMetalGrad)"
              filter="url(#botDepthShadow)"
            />
            <circle cx="102" cy="50" r="3" fill="#06b6d4" filter="url(#neonGlow)" />
          </g>

          {/* Robot Torso / Floating Pod */}
          <g filter="url(#botDepthShadow)">
            <path
              d="M38 78C38 74 44 72 60 72C76 72 82 74 82 78L86 98C86 106 74 112 60 112C46 112 34 106 34 98L38 78Z"
              fill="url(#botBodyGrad)"
            />
            {/* Chest Glowing Core Badge */}
            <ellipse cx="60" cy="91" rx="8" ry="8" fill="#141426" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="60" cy="91" r="5" fill="url(#botEyeGrad)" filter="url(#neonGlow)" className="bot-chest-core" />
            <circle cx="58.5" cy="89.5" r="1.5" fill="#ffffff" />

            {/* Jet Thruster Flame / Aura */}
            <path
              d="M52 112C52 112 55 124 60 126C65 124 68 112 68 112Z"
              fill="url(#botEyeGrad)"
              filter="url(#neonGlow)"
              className="bot-thruster-flame"
            />
          </g>

          {/* Floating Hands (Cute curved pods) */}
          <g className="bot-hand-left">
            <ellipse
              cx="26"
              cy="86"
              rx="6"
              ry="11"
              transform="rotate(18 26 86)"
              fill="url(#botHeadGrad)"
              filter="url(#botDepthShadow)"
            />
          </g>
          <g className="bot-hand-right">
            <ellipse
              cx="94"
              cy="86"
              rx="6"
              ry="11"
              transform="rotate(-18 94 86)"
              fill="url(#botHeadGrad)"
              filter="url(#botDepthShadow)"
            />
          </g>

          {/* Neck Ring */}
          <ellipse
            cx="60"
            cy="72"
            rx="20"
            ry="6"
            fill="url(#botMetalGrad)"
          />

          {/* 3D Spherical Head */}
          <g filter="url(#botDepthShadow)">
            <ellipse
              cx="60"
              cy="48"
              rx="41"
              ry="32"
              fill="url(#botHeadGrad)"
            />
            {/* Highlight Crescent on Top of Head */}
            <path
              d="M32 30C40 22 55 18 68 18C78 18 88 22 93 28C84 22 72 20 60 20C46 20 37 24 32 30Z"
              fill="#ffffff"
              opacity="0.45"
            />
          </g>

          {/* Curved Dark Glass Visor */}
          <g>
            <rect
              x="29"
              y="32"
              width="62"
              height="32"
              rx="16"
              fill="url(#botVisorGrad)"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1.2"
            />

            {/* Visor 3D Curved Light Reflection */}
            <path
              d="M32 40C32 34 38 33 46 33H74C82 33 88 34 88 40C78 36 68 35 60 35C52 35 42 36 32 40Z"
              fill="url(#botGlossGrad)"
            />

            {/* Glowing Expressive Cyan Eyes */}
            <g className="bot-eyes" filter="url(#neonGlow)">
              {/* Left Eye */}
              <ellipse
                cx="47"
                cy="47"
                rx="6.5"
                ry="8"
                fill="url(#botEyeGrad)"
                className="bot-eye-left"
              />
              {/* Left Eye Sparkle */}
              <circle cx="49" cy="44.5" r="2" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse
                cx="73"
                cy="47"
                rx="6.5"
                ry="8"
                fill="url(#botEyeGrad)"
                className="bot-eye-right"
              />
              {/* Right Eye Sparkle */}
              <circle cx="75" cy="44.5" r="2" fill="#ffffff" />
            </g>

            {/* Cute Cheeks */}
            <ellipse cx="38" cy="55" rx="3" ry="1.5" fill="#f43f5e" opacity="0.35" />
            <ellipse cx="82" cy="55" rx="3" ry="1.5" fill="#f43f5e" opacity="0.35" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Bot3D;
