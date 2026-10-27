import { Link } from "react-router-dom";
import { FiUser, FiBookOpen, FiMapPin, FiAward, FiArrowUpRight } from "react-icons/fi";
import { education } from "../../data/education";

const About = () => {
  // Only display college card on the home page as requested
  const college = education[0];

  return (
    <section id="about" className="section-wrap">
      <div className="section-header">
        <h2 className="section-title">
          <FiUser className="section-title-icon" aria-hidden="true" />
          <span>About Me</span>
        </h2>
      </div>

      <div className="about-content-card glass-card">
        {/* Authentic Biography */}
        <p className="about-bio-text">
          I'm an IT student and an aspiring full-stack developer who enjoys building modern and scalable web applications. My journey into development started with learning core programming concepts and Java, which gradually led me to explore full-stack development using React, Spring Boot, and PostgreSQL.
        </p>
        <p className="about-bio-text secondary">
          Outside of coursework, I actively improve my problem-solving skills by practicing Data Structures and Algorithms while continuing to explore new technologies. I'm naturally curious, consistent in learning, and motivated to grow into a software engineer who builds meaningful, impactful solutions.
        </p>

        {/* College Education Spotlight (College Only - Schools stay on /about) */}
        {college && (
          <div className="about-sub-block">
            <h3 className="sub-block-title">
              <FiBookOpen className="inline-icon" /> Education
            </h3>
            <div className="about-college-card-wrap">
              <div className="education-timeline-card glass-card">
                <div className="edu-timeline-badge" aria-hidden="true">
                  <FiBookOpen />
                </div>
                <div className="edu-timeline-body">
                  <div className="edu-timeline-header">
                    <div>
                      <span className="edu-timeline-type">{college.type || "Undergraduate Degree"}</span>
                      <h4 className="edu-timeline-inst">{college.institution}</h4>
                      <p className="edu-timeline-prog">{college.program}</p>
                    </div>
                    <div className="edu-timeline-meta">
                      <span className="edu-timeline-year">{college.year}</span>
                      {college.location && (
                        <span className="edu-timeline-loc">
                          <FiMapPin style={{ fontSize: "0.8em" }} /> {college.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {college.grade && (() => {
                    const certLink = college.certificateLink || college.link || college.certificateUrl;

                    if (certLink) {
                      return (
                        <a
                          href={certLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="edu-timeline-honor-pill is-link"
                          title={`View ${college.grade} Certificate / Marksheet`}
                          aria-label={`View certificate for ${college.grade} at ${college.institution}`}
                        >
                          <FiAward className="inline-icon" />
                          <span className="edu-grade-text">{college.grade}</span>
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
                        <span className="edu-grade-text">{college.grade}</span>
                      </div>
                    );
                  })()}

                  <p className="edu-timeline-focus">
                    <strong>Core Focus:</strong> {college.focus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* More About Me Button (Matching View All Projects design) */}
        <div className="view-all-projects-wrapper" style={{ marginTop: "2.25rem" }}>
          <Link
            to="/about"
            className="learn-more uiverse-learn-more"
            id="more-about-me-btn"
            aria-label="More about my background, education, and achievements"
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow" />
            </span>
            <span className="button-text">More About Me</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
