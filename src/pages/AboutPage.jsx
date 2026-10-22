import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiBookOpen,
  FiAward,
  FiArrowUpRight,
  FiCheckCircle,
  FiMapPin,
  FiFolder,
  FiDownload,
  FiMail,
} from "react-icons/fi";
import { profile, achievements, education } from "../content/site";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const corePhilosophy = [
  {
    title: "Building Reliable Backend Systems",
    desc: "I enjoy building backend applications with Java and Spring Boot, focusing on clean code, secure APIs, and well-structured microservices. My goal is to create systems that are reliable, maintainable, and easy to scale.",
  },
  {
    title: "Learning Through Problem Solving",
    desc: "I regularly practice Data Structures and Algorithms to improve my problem-solving skills. From arrays and trees to graphs and dynamic programming, I focus on understanding the logic and finding efficient solutions.",
  },
  {
    title: "Creating Better User Experiences",
    desc: "I use React to build responsive and intuitive interfaces that work smoothly with backend services. I enjoy improving the overall user experience through clean layouts, thoughtful interactions, and real-time features.",
  },
];

  return (
    <div className="about-page section-wrap">
      {/* Top Breadcrumb & Return Link */}
      <div className="projects-page-nav-bar">
        <Link to="/" className="back-to-home-link" id="back-to-home-btn">
          <FiArrowLeft className="back-link-icon" />
          <span>Back to Overview</span>
        </Link>
        <div className="about-status-badge">
          <span className="about-badge-dot" />
          <span>JIT MONDAL</span>
        </div>
      </div>

      {/* Header Showcase Section */}
      <header className="all-projects-header">
        <div className="projects-kicker">
          <FiUser className="kicker-icon" />
          <span>ENGINEERING PROFILE & BACKGROUND</span>
        </div>
        <h1 className="all-projects-title">About Me</h1>
        <p className="all-projects-subtitle">
          Student of Information Technology, aspiring Full-Stack Software Engineer, and competitive programmer focused on resilient backend systems, distributed architectures, and modern web applications with Java, Spring Boot, and React.
        </p>
      </header>

      {/* Hero Dossier Card with Portrait & Quick Facts */}
      <div className="about-dossier-card glass-card">
        <div className="about-dossier-avatar-col">
          <div className="about-dossier-avatar-wrap">
            <img
              src={profile.portrait || "/j-pic.jpeg"}
              alt={profile.name}
              className="about-dossier-avatar"
              onError={(e) => {
                e.currentTarget.src = "/j-pic.jpeg";
              }}
            />
          </div>
          <div className="about-dossier-status-pill">
            <span className="status-dot-pulse" />
            <span>{profile.availability}</span>
          </div>
        </div>

        <div className="about-dossier-content-col">
          <h2 className="about-dossier-name">{profile.name}</h2>
          <p className="about-dossier-role">{profile.role}</p>

          <div className="about-dossier-meta-grid">
            <div className="dossier-meta-item">
              <FiMapPin className="dossier-meta-icon" />
              <span>{profile.location}</span>
            </div>
            <div className="dossier-meta-item">
              <FiBookOpen className="dossier-meta-icon" />
              <span>JIS College of Engineering</span>
            </div>
            <div className="dossier-meta-item">
              <FiAward className="dossier-meta-icon" />
              <span>Ranked 1st in IT Department</span>
            </div>
          </div>

          <p className="about-bio-text">
            My journey into computer science began with learning core programming concepts and Java, which evolved into a passionate pursuit of backend engineering, distributed microservices, and full-stack development. I enjoy taking an idea from architectural whiteboard sketches to production-ready APIs with Spring Boot, PostgreSQL, Docker, and React.
          </p>
          <p className="about-bio-text secondary">
            Outside coursework, I continually sharpen my problem-solving skills with competitive programming and Data Structures & Algorithms, while exploring cloud deployment and event-driven patterns with Apache Kafka. I am driven by consistency, disciplined curiosity, and the desire to build robust digital infrastructure.
          </p>

          <div className="about-dossier-actions">
            <a
              href={profile.resume}
              download
              className="about-action-btn primary"
              aria-label="Download CV"
            >
              <FiDownload />
              <span>Download CV</span>
            </a>
            <Link to="/#contact" className="about-action-btn secondary">
              <FiMail />
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Comprehensive Academic Journey & Education (College + Schooling) */}
      <section className="about-page-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiBookOpen className="section-title-icon" aria-hidden="true" />
            <span>Academic Journey & Education</span>
          </h2>
        </div>

        <div className="about-education-timeline">
          {education.map((edu, index) => (
            <div key={edu.institution} className="education-timeline-card glass-card">
              <div className="edu-timeline-badge">{index + 1}</div>
              <div className="edu-timeline-body">
                <div className="edu-timeline-header">
                  <div>
                    <span className="edu-timeline-type">{edu.type || "Academic"}</span>
                    <h3 className="edu-timeline-inst">{edu.institution}</h3>
                    <p className="edu-timeline-prog">{edu.program}</p>
                  </div>
                  <div className="edu-timeline-meta">
                    <span className="edu-timeline-year">{edu.year}</span>
                    {edu.location && (
                      <span className="edu-timeline-loc">
                        <FiMapPin style={{ fontSize: "0.8em" }} /> {edu.location}
                      </span>
                    )}
                  </div>
                </div>

                {edu.grade && (() => {
                  const certLink = edu.certificateLink || edu.link || edu.certificateUrl;

                  if (certLink) {
                    return (
                      <a
                        href={certLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="edu-timeline-honor-pill is-link"
                        title={`View ${edu.grade} Certificate / Marksheet`}
                        aria-label={`View certificate for ${edu.grade} at ${edu.institution}`}
                      >
                        <FiAward className="inline-icon" />
                        <span className="edu-grade-text">{edu.grade}</span>
                        <span className="edu-cert-badge">
                          <span>View Certificate</span>
                          <FiArrowUpRight className="cert-arrow-icon" />
                        </span>
                      </a>
                    );
                  }

                  return (
                    <div className="edu-timeline-honor-pill">
                      <FiAward className="inline-icon" />
                      <span className="edu-grade-text">{edu.grade}</span>
                    </div>
                  );
                })()}

                <p className="edu-timeline-focus">
                  <strong>Core Focus:</strong> {edu.focus}
                </p>

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="edu-timeline-highlights">
                    {edu.highlights.map((item) => (
                      <li key={item}>
                        <FiCheckCircle className="highlight-check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Honors, Certifications & Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="about-page-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiAward className="section-title-icon" aria-hidden="true" />
              <span>Honors & Verified Achievements</span>
            </h2>
          </div>

          <div className="about-credentials-grid">
            {achievements.map((item) => {
              const certLink = item.link || item.href || item.url || item.certificateUrl;

              return (
                <div
                  key={item.title}
                  className={`credential-card glass-card ${certLink ? "has-cert-link" : ""}`}
                >
                  <div className="credential-top-row">
                    <span className="credential-tag">{item.tag}</span>
                    {certLink && (
                      <a
                        href={certLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="credential-verify-btn"
                        title="Verify Credential"
                        aria-label={`Verify credential for ${item.title}`}
                      >
                        <span>Verify Certificate</span>
                        <FiArrowUpRight className="verify-icon" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <h3 className="credential-title">{item.title}</h3>
                  <p className="credential-desc">{item.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Core Engineering Principles & Focus */}
      <section className="about-page-section">
        <div className="section-header">
          <h2 className="section-title">
            <FiCheckCircle className="section-title-icon" aria-hidden="true" />
            <span>Engineering Approach & Values</span>
          </h2>
        </div>

        <div className="about-pillars-grid">
          {corePhilosophy.map((pillar) => (
            <div key={pillar.title} className="about-pillar-card glass-card">
              <div className="pillar-header">
                <FiCheckCircle className="pillar-icon" />
                <h3 className="pillar-title">{pillar.title}</h3>
              </div>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Block */}
      <div className="about-footer-cta glass-card">
        <div className="about-cta-content">
          <h3 className="about-cta-title">Want to see my code in action?</h3>
          <p className="about-cta-subtitle">
            Explore complete full-stack web applications, microservices, and reactive APIs built with Spring Boot, Kafka, and React.
          </p>
        </div>
        <div className="about-cta-actions">
          <Link to="/projects" className="about-action-btn primary">
            <FiFolder />
            <span>View All Projects</span>
          </Link>
          <Link to="/#contact" className="about-action-btn secondary">
            <FiMail />
            <span>Contact Me</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
