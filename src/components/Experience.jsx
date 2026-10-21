import { useState } from "react";
import { FiBriefcase, FiChevronDown, FiExternalLink, FiMapPin, FiCalendar } from "react-icons/fi";
import { experiences } from "../content/site";

const Experience = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="experience" className="section-wrap">
      <div className="section-header">
        <h2 className="section-title">
          <FiBriefcase className="section-title-icon" aria-hidden="true" />
          <span>Work & Experience</span>
        </h2>
        <span className="section-subtext">Hover or click any role to reveal details</span>
      </div>

      <div className="timeline-container">
        {/* Vertical dashed line */}
        <div className="timeline-line" aria-hidden="true" />

        <div className="timeline-items">
          {experiences.map((item, index) => {
            const isOpen = !!openItems[index];

            return (
              <div
                key={item.role + item.company}
                className="timeline-item"
                onMouseEnter={() => setOpenItems((prev) => ({ ...prev, [index]: true }))}
              >
                {/* Circular Badge Icon */}
                <div className="timeline-badge" aria-hidden="true">
                  <span className="badge-text">{item.logoText}</span>
                </div>

                {/* Card Content with collapsible details */}
                <div className="timeline-card glass-card">
                  <button
                    type="button"
                    className="timeline-summary"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                  >
                    <div className="timeline-header-text">
                      <div className="timeline-meta">
                        <span className="timeline-period">
                          <FiCalendar className="inline-icon" /> {item.period}
                        </span>
                        <span className="timeline-loc">
                          <FiMapPin className="inline-icon" /> {item.location}
                        </span>
                      </div>

                      <h3 className="timeline-role">{item.role}</h3>

                      <p className="timeline-company">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="company-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{item.company}</span>
                            <FiExternalLink className="company-link-icon" />
                          </a>
                        ) : (
                          <span>{item.company}</span>
                        )}
                      </p>
                    </div>

                    <div className={`timeline-chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
                      <FiChevronDown />
                    </div>
                  </button>

                  {/* Hidden Data: Revealed on hover or expand */}
                  <div className={`timeline-expandable ${isOpen ? "expanded" : ""}`}>
                    <ul className="timeline-bullets">
                      {item.description.map((bullet, bIdx) => (
                        <li key={bIdx} className="timeline-bullet">
                          <span className="bullet-dot">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {item.techStack && (
                      <div className="timeline-tech-row">
                        <span className="tech-stack-label">Tech Stack:</span>
                        <span className="tech-stack-items">{item.techStack}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
