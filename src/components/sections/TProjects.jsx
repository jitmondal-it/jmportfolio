import { FiFolder } from "react-icons/fi";
import { Link } from "react-router-dom";
import { featuredProjects, additionalProjects } from "../../data/projects";
import ProjectCard from "./ProjectCard";

const Projects = () => {
  const allProjects = [...featuredProjects, ...additionalProjects];
  // Limit to only 4 projects on the home overview
  const displayedProjects = allProjects.slice(0, 4);

  return (
    <section id="projects" className="section-wrap">
      <div className="section-header">
        <h2 className="section-title">
          <FiFolder className="section-title-icon" aria-hidden="true" />
          <span>Featured Projects</span>
        </h2>
      </div>

      {/* Clean Projects Grid */}
      <div className="projects-grid">
        {displayedProjects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            variant="featured"
          />
        ))}
      </div>

      {/* View All Projects Action Trigger with Expanding Circle Arrow Design */}
      <div className="view-all-projects-wrapper">
        <Link
          to="/projects"
          className="learn-more uiverse-learn-more"
          id="view-all-projects-btn"
          aria-label="View all engineering projects"
        >
          <span className="circle" aria-hidden="true">
            <span className="icon arrow" />
          </span>
          <span className="button-text">View All Projects</span>
        </Link>
      </div>
    </section>
  );
};

export default Projects;
