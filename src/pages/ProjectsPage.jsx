import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiFolder,
  FiSearch,
  FiX,
  FiLayers,
  FiGithub,
  FiMail,
} from "react-icons/fi";
import { featuredProjects, additionalProjects, projectCategories as categories } from "../data/projects";
import ProjectCard from "../components/sections/ProjectCard";

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const allProjects = useMemo(() => {
    return [...featuredProjects, ...additionalProjects];
  }, []);

  // Filter projects based on category and search query
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // Category match
      let matchesCat = true;
      if (activeCategory !== "all") {
        const catConfig = categories.find((c) => c.id === activeCategory);
        if (catConfig && catConfig.match) {
          matchesCat = catConfig.match.some(
            (kw) =>
              project.category.toLowerCase().includes(kw.toLowerCase()) ||
              project.title.toLowerCase().includes(kw.toLowerCase())
          );
        }
      }

      // Search query match
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = project.title.toLowerCase().includes(q);
        const inDesc = project.description.toLowerCase().includes(q);
        const inCat = project.category.toLowerCase().includes(q);
        const inTech = project.tech?.some((t) => t.toLowerCase().includes(q));
        const inArch = project.architecture?.some((a) => a.toLowerCase().includes(q));

        matchesSearch = inTitle || inDesc || inCat || inTech || inArch;
      }

      return matchesCat && matchesSearch;
    });
  }, [allProjects, activeCategory, searchQuery]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("project-highlight-target");
          setTimeout(() => {
            element.classList.remove("project-highlight-target");
          }, 2400);
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.hash]);

  return (
    <div className="all-projects-page section-wrap">
      {/* Top Breadcrumb & Return Link */}
      <div className="projects-page-nav-bar">
        <Link to="/" className="back-to-home-link" id="back-to-home-btn">
          <FiArrowLeft className="back-link-icon" />
          <span>Back to Overview</span>
        </Link>
        <span className="page-counter-badge">
          {filteredProjects.length} of {allProjects.length} Projects Available
        </span>
      </div>

      {/* Header Showcase Section */}
      <header className="all-projects-header">
        <div className="projects-kicker">
          <FiFolder className="kicker-icon" />
          <span>SYSTEM ARCHITECTURE ARCHIVES</span>
        </div>
        <h1 className="all-projects-title">All Engineering Projects</h1>
        <p className="all-projects-subtitle">
          Explore complete full-stack web applications, distributed microservice topologies,
          high-concurrency realtime messaging systems, and algorithmic solutions engineered with Java, Spring Boot, Kafka, and React.
        </p>
      </header>

      {/* Interactive Toolbar: Search Bar + Filter Tags */}
      <div className="projects-filter-bar glass-card">
        {/* Search Input */}
        <div className="projects-search-box">
          <FiSearch className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="projects-search-input"
            placeholder="Search by tech (e.g. Kafka, React, Spring), title, or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search projects"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="projects-category-tabs" role="tablist">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                {cat.id === "all" ? (
                  <span className="tab-count">{allProjects.length}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Spotlight Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              variant="featured"
            />
          ))}
        </div>
      ) : (
        <div className="projects-empty-state glass-card">
          <FiLayers className="empty-state-icon" />
          <h3 className="empty-state-title">No projects found</h3>
          <p className="empty-state-text">
            No projects matched your search for "<strong>{searchQuery}</strong>". Try clearing your filters or searching for different keywords like <em>Spring Boot, React, Kafka, or WebSocket</em>.
          </p>
          <button
            type="button"
            className="btn-clean-link primary"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bottom Engineering Callout */}
      <section className="projects-page-footer-card glass-card">
        <div className="footer-card-content">
          <h3 className="footer-card-title">Looking for something specific or custom?</h3>
          <p className="footer-card-desc">
            All repositories feature comprehensive documentation, Dockerized setups, and modular schemas. Feel free to explore the source code or reach out directly for system architecture discussions.
          </p>
          <div className="footer-card-actions">
            <Link to="/#contact" className="btn-clean-link primary">
              <FiMail className="icon-mr" />
              <span>Get In Touch</span>
            </Link>
            <a
              href="https://github.com/jitmondal-it"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-clean-link"
            >
              <FiGithub className="icon-mr" />
              <span>GitHub Repositories</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
