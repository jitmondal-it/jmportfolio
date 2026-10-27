import { useState } from "react";
import { FiArrowUpRight, FiCheckCircle, FiExternalLink, FiGithub, FiLayers } from "react-icons/fi";

const pad = (value) => String(value).padStart(2, "0");

const ProjectCase = ({ project, index }) => {
  const [imageFailed, setImageFailed] = useState(!project.image);
  const isPending = project.status === "pending";

  return (
    <article className={`project-case-card ${isPending ? "is-pending" : ""}`}>
      {/* Left / Main Editorial Details */}
      <div className="case-content">
        {/* Case Study Meta Tag */}
        <div className="case-meta-bar">
          <span className="case-index">CASE #{pad(index + 1)}</span>
          <span className="case-divider">//</span>
          <span className="case-category">{project.category || "Software Engineering"}</span>
          <span className={`case-status-badge ${project.status}`}>
            <span className="badge-dot" />
            <span>{isPending ? "In Progress" : "Engineered"}</span>
          </span>
        </div>

        {/* Project Title & Tagline */}
        <h3 className="case-title">{project.title}</h3>
        {project.tagline && <p className="case-tagline">{project.tagline}</p>}

        {/* Project Description */}
        <p className="case-description">{project.description}</p>

        {/* Architectural Highlights */}
        {project.architecture && project.architecture.length > 0 && (
          <div className="case-architecture">
            <h4 className="architecture-label">
              <FiLayers className="label-icon" aria-hidden="true" />
              <span>Architectural Highlights</span>
            </h4>
            <ul className="architecture-list">
              {project.architecture.map((item, idx) => (
                <li key={idx}>
                  <FiCheckCircle className="check-icon" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies Used */}
        <div className="case-tech-stack">
          {project.tech.map((item) => (
            <span className="tech-badge" key={item}>
              {item}
            </span>
          ))}
        </div>

        {/* Repository & Demo Actions */}
        {project.links && project.links.length > 0 ? (
          <div className="case-actions">
            {project.links.map((link) => {
              const isLive = link.label.toLowerCase().includes("live");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={isLive ? "btn-action-primary" : "btn-action-outline"}
                >
                  {isLive ? (
                    <>
                      <FiExternalLink className="btn-icon-sm" aria-hidden="true" />
                      <span>{link.label}</span>
                    </>
                  ) : (
                    <>
                      <FiGithub className="btn-icon-sm" aria-hidden="true" />
                      <span>{link.label}</span>
                    </>
                  )}
                  <FiArrowUpRight className="arrow-hover" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        ) : (
          <p className="pending-disclaimer">
            Architecture and codebase documentation will be released upon milestone completion.
          </p>
        )}
      </div>

      {/* Right / Visual Showcase */}
      <div className="case-visual">
        <div className="mockup-window">
          {/* Mockup Window Header */}
          <div className="mockup-header">
            <div className="window-dots" aria-hidden="true">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="mockup-url-bar">
              <code>
                {project.links?.[0]?.href
                  ? new URL(project.links[0].href).hostname
                  : `${project.title.toLowerCase().replace(/\s+/g, "-")}.internal`}
              </code>
            </div>
          </div>

          {/* Mockup Screen Content */}
          <div className="mockup-body">
            {!imageFailed && project.image ? (
              <img
                src={project.image}
                alt={`${project.title} interface preview`}
                className="mockup-image"
                loading="lazy"
                width={720}
                height={450}
                onError={() => setImageFailed(true)}
              />
            ) : (
              /* High-End Architectural Diagram Fallback */
              <div className="system-diagram-fallback">
                <div className="diagram-grid">
                  <div className="diagram-node node-client">
                    <span className="node-tag">CLIENT LAYER</span>
                    <strong>React / TypeScript</strong>
                    <span className="node-sub">Tailwind • Dynamic UI</span>
                  </div>

                  <div className="diagram-connector">
                    <span className="connector-line" />
                    <span className="connector-label">
                      {project.title.includes("Synapse") ? "WebSocket STOMP" : "REST / HTTPS"}
                    </span>
                  </div>

                  <div className="diagram-node node-backend">
                    <span className="node-tag">CORE ENGINE</span>
                    <strong>Spring Boot 3</strong>
                    <span className="node-sub">Security • Services</span>
                  </div>

                  <div className="diagram-connector">
                    <span className="connector-line" />
                    <span className="connector-label">JPA / Driver</span>
                  </div>

                  <div className="diagram-node node-storage">
                    <span className="node-tag">PERSISTENCE</span>
                    <strong>MongoDB & SQL</strong>
                    <span className="node-sub">Structured & Logs</span>
                  </div>
                </div>

                <div className="diagram-caption">
                  <span>SYSTEM BLUEPRINT // {project.title.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCase;
