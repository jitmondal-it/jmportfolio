import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiX,
} from "react-icons/fi";
import { skillGroups, techIconMap } from "../../data/skills";

const getTechIcon = (techName, customProjectIcons = {}) => {
  if (!techName) return null;

  if (customProjectIcons && customProjectIcons[techName]) {
    return customProjectIcons[techName];
  }

  if (skillGroups && Array.isArray(skillGroups)) {
    const cleanName = techName.trim().toLowerCase();
    for (const group of skillGroups) {
      if (group.items && Array.isArray(group.items)) {
        const found = group.items.find((item) => {
          if (!item.name || !item.icon) return false;
          const iName = item.name.trim().toLowerCase();
          return (
            iName === cleanName ||
            iName.startsWith(cleanName) ||
            cleanName.startsWith(iName) ||
            (cleanName.includes("javascript") && iName.includes("javascript")) ||
            (cleanName.includes("tailwind") && iName.includes("tailwind")) ||
            (cleanName.includes("spring") && iName.includes("spring"))
          );
        });
        if (found && found.icon) return found.icon;
      }
    }
  }

  if (techIconMap && techIconMap[techName]) return techIconMap[techName];
  if (techIconMap) {
    const lower = techName.trim().toLowerCase();
    for (const [key, val] of Object.entries(techIconMap)) {
      if (
        key.toLowerCase() === lower ||
        key.toLowerCase().includes(lower) ||
        lower.includes(key.toLowerCase())
      ) {
        return val;
      }
    }
  }

  return null;
};

const getProjectSlug = (title) => {
  if (!title) return "project";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// =========================================================================
// COMPREHENSIVE PROJECT DETAILS POPUP MODAL
// Displays all project information, architecture blueprint, tech & links
// =========================================================================
const ProjectDetailsModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="project-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="project-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} Full Details`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="project-modal-header">
          <div className="project-modal-title-group">
            <div className="project-modal-meta-row">
              <span className="card-category-badge">{project.category}</span>
              {project.status && (
                <span className={`project-status-chip ${project.status}`}>
                  <span className="status-chip-dot" />
                  <span className="status-chip-text">
                    {project.status === "live" ? "Live" : project.status}
                  </span>
                </span>
              )}
            </div>
            <h3 className="project-modal-heading">
              {project.icon && (
                <img
                  src={project.icon}
                  alt=""
                  className="card-project-icon"
                  aria-hidden="true"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span>{project.title}</span>
            </h3>
            {project.tagline && (
              <p className="project-modal-tagline">{project.tagline}</p>
            )}
          </div>

          <button
            type="button"
            className="project-modal-close-btn"
            onClick={onClose}
            aria-label="Close project details"
            title="Close"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="project-modal-body">
          {/* Project Screenshot Showcase */}
          {project.image && (
            <div className="project-modal-image-wrap">
              <img
                src={project.image}
                alt={project.title}
                className="project-modal-image"
                loading="lazy"
              />
            </div>
          )}

          {/* Full Authentic Description */}
          <div className="project-modal-section">
            <h4 className="project-modal-section-title">Overview</h4>
            <p className="project-modal-desc">{project.description}</p>
          </div>

          {/* Key Architecture Blueprint Highlights */}
          {project.architecture && project.architecture.length > 0 && (
            <div className="project-modal-section">
              <h4 className="project-modal-section-title">
                <FiLayers className="inline-icon" aria-hidden="true" />
                <span>Key Architecture ({project.architecture.length})</span>
              </h4>
              <ul className="project-modal-arch-list">
                {project.architecture.map((point, idx) => (
                  <li key={idx} className="project-modal-arch-item">
                    <FiCheckCircle className="arch-check-icon" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Complete Technology Stack */}
          {project.tech && project.tech.length > 0 && (
            <div className="project-modal-section">
              <h4 className="project-modal-section-title">Technologies Used</h4>
              <div className="project-modal-tech-grid">
                {project.tech.map((tName) => {
                  const iconPath = getTechIcon(tName, project.techIcons);
                  return (
                    <span key={tName} className="clean-tech-pill">
                      {iconPath && (
                        <img
                          src={iconPath}
                          alt=""
                          className="clean-tech-icon"
                          aria-hidden="true"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span>{tName}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="project-modal-footer">
          <button
            type="button"
            className="btn-close-arch-dialog"
            onClick={onClose}
          >
            Close
          </button>

          {project.links && project.links.length > 0 && (
            <div className="project-modal-actions">
              {project.links.map((link) => {
                const isLive =
                  link.label.toLowerCase().includes("live") ||
                  link.label.toLowerCase().includes("demo");
                return (
                  <a
                    key={link.href + link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`card-link-btn ${isLive ? "primary" : "secondary"}`}
                  >
                    {isLive ? (
                      <FiExternalLink className="btn-icon" aria-hidden="true" />
                    ) : (
                      <FiGithub className="btn-icon" aria-hidden="true" />
                    )}
                    <span>{link.label}</span>
                    {!isLive && (
                      <FiArrowUpRight className="arrow-icon" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const ProjectCard = ({ project, variant = "featured" }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const slug = getProjectSlug(project.title);

  // =========================================================================
  // HOMEPAGE FEATURED PROJECT CARD VARIANT (Clean, focused & uncluttered)
  // Clicking "View Project Details" opens the complete popup screen!
  // =========================================================================
  if (variant === "featured") {
    const visibleTech = project.tech ? project.tech.slice(0, 4) : [];
    const remainingCount = (project.tech?.length || 0) - visibleTech.length;

    return (
      <article id={slug} className="featured-project-card">
        {detailsOpen && (
          <ProjectDetailsModal
            project={project}
            onClose={() => setDetailsOpen(false)}
          />
        )}

        {/* 1. Large, visually appealing project screenshot - triggers popup details */}
        {project.image && (
          <button
            type="button"
            className="featured-card-media"
            onClick={() => setDetailsOpen(true)}
            aria-label={`View full details and architecture for ${project.title}`}
          >
            <img
              src={project.image}
              alt={project.title}
              className="featured-project-image"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = "none";
              }}
            />
            <div className="featured-media-overlay" aria-hidden="true" />
          </button>
        )}

        {/* Card Main Body */}
        <div className="featured-card-body">
          {/* 3. Existing Project Category & Subtle Status Chip */}
          <div className="featured-card-meta">
            <span className="featured-category-badge">{project.category}</span>
            {project.status && (
              <span className={`project-status-chip ${project.status}`}>
                <span className="status-chip-dot" />
                <span className="status-chip-text">
                  {project.status === "live" ? "Live" : project.status}
                </span>
              </span>
            )}
          </div>

          {/* 2. Project Title - triggers popup details */}
          <h3 className="featured-project-title">
            <button
              type="button"
              className="featured-title-btn"
              onClick={() => setDetailsOpen(true)}
              aria-label={`View full details for ${project.title}`}
            >
              {project.icon && (
                <img
                  src={project.icon}
                  alt=""
                  className="card-project-icon"
                  aria-hidden="true"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span>{project.title}</span>
            </button>
          </h3>

          {/* 4. Concise Visual Presentation of the Existing Description */}
          <p className="featured-project-desc" title={project.description}>
            {project.description}
          </p>

          {/* 5. Compact Display of the Most Relevant Existing Technologies */}
          {project.tech && project.tech.length > 0 && (
            <div className="featured-card-tech" aria-label="Key Technologies">
              {visibleTech.map((tName) => {
                const iconPath = getTechIcon(tName, project.techIcons);
                return (
                  <span key={tName} className="featured-tech-pill">
                    {iconPath && (
                      <img
                        src={iconPath}
                        alt=""
                        className="tech-pill-icon"
                        aria-hidden="true"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <span>{tName}</span>
                  </span>
                );
              })}
              {remainingCount > 0 && (
                <span className="featured-tech-pill tech-pill-more">
                  +{remainingCount} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* 6. One Clear Action: Open Project Details Popup Screen */}
        <div className="featured-card-footer">
          <button
            type="button"
            className="featured-action-btn"
            onClick={() => setDetailsOpen(true)}
            aria-label={`View complete details and architecture for ${project.title}`}
          >
            <span>View Project Details</span>
            <FiLayers className="featured-action-arrow" aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  }

  // =========================================================================
  // DETAILED PROJECT CARD (Used on the dedicated /projects page)
  // Preserves full details, architecture modal trigger, all repos & demos
  // =========================================================================
  return (
    <article id={slug} className="clean-project-card detailed-project-card">
      {detailsOpen && (
        <ProjectDetailsModal
          project={project}
          onClose={() => setDetailsOpen(false)}
        />
      )}

      {/* Project Showcase Image - triggers popup details */}
      {project.image && (
        <button
          type="button"
          onClick={() => setDetailsOpen(true)}
          className="card-image-wrap card-image-btn"
          aria-label={`View full details and architecture for ${project.title}`}
        >
          <img
            src={project.image}
            alt={project.title}
            className="card-project-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.parentElement.style.display = "none";
            }}
          />
        </button>
      )}

      {/* Main Content Body */}
      <div className="card-main-body">
        {/* Top Bar: Authentic Category & Status Badge */}
        <div className="card-top-row">
          <span className="card-category-badge">{project.category}</span>
          {project.status && (
            <span className={`project-status-chip ${project.status}`}>
              <span className="status-chip-dot" />
              <span className="status-chip-text">
                {project.status === "live" ? "Live" : project.status}
              </span>
            </span>
          )}
        </div>

        {/* Project Title - triggers popup details */}
        <h3 className="clean-project-title">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="clean-title-btn"
            aria-label={`View full details for ${project.title}`}
          >
            {project.icon && (
              <img
                src={project.icon}
                alt=""
                className="card-project-icon"
                aria-hidden="true"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <span>{project.title}</span>
          </button>
        </h3>

        {/* Authentic Tagline */}
        {project.tagline && (
          <p className="clean-project-tagline">{project.tagline}</p>
        )}

        {/* Authentic Full Description */}
        <p className="clean-project-desc">{project.description}</p>
      </div>

      {/* Bottom Pinned Tray */}
      <div className="card-pinned-footer">
        {/* Authentic Architecture Blueprint Trigger */}
        {project.architecture && project.architecture.length > 0 && (
          <button
            type="button"
            className="arch-blueprint-btn"
            onClick={() => setDetailsOpen(true)}
            aria-label={`View ${project.title} Architecture Blueprint`}
          >
            <span className="arch-btn-left">
              <FiLayers className="arch-btn-icon" aria-hidden="true" />
              <span>Key Architecture ({project.architecture.length})</span>
            </span>
            <span className="arch-btn-action">
              <span>View</span>
              <FiArrowUpRight className="arch-btn-arrow" aria-hidden="true" />
            </span>
          </button>
        )}

        {/* Authentic Complete Tech Stack */}
        {project.tech && project.tech.length > 0 && (
          <div className="clean-tech-row">
            {project.tech.map((tName) => {
              const iconPath = getTechIcon(tName, project.techIcons);
              return (
                <span key={tName} className="clean-tech-pill">
                  {iconPath && (
                    <img
                      src={iconPath}
                      alt=""
                      className="clean-tech-icon"
                      aria-hidden="true"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <span>{tName}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Authentic Action Links */}
        {project.links && project.links.length > 0 && (
          <div className="card-action-links-row">
            {project.links.map((link) => {
              const isLive =
                link.label.toLowerCase().includes("live") ||
                link.label.toLowerCase().includes("demo");
              return (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card-link-btn ${isLive ? "primary" : "secondary"}`}
                >
                  {isLive ? (
                    <FiExternalLink className="btn-icon" aria-hidden="true" />
                  ) : (
                    <FiGithub className="btn-icon" aria-hidden="true" />
                  )}
                  <span>{link.label}</span>
                  {!isLive && (
                    <FiArrowUpRight className="arrow-icon" aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
