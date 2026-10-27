import { useState } from "react";
import { FiCpu, FiLayers } from "react-icons/fi";
import { skillCategories, skillGroups, techIconMap } from "../../data/skills";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const categories = skillCategories || [
    { id: "all", label: "All" },
    { id: "backend", label: "Backend" },
    { id: "data", label: "Data" },
    { id: "frontend", label: "Frontend" },
  ];

  const filteredGroups =
    activeCategory === "all"
      ? skillGroups
      : skillGroups.filter((group) => group.category === activeCategory);

  return (
    <section id="skills" className="section-wrap">
      <div className="section-header">
        <h2 className="section-title">
          <FiCpu className="section-title-icon" aria-hidden="true" />
          <span>Skills & Technologies</span>
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="skills-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`skills-tab-pill ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {filteredGroups.map((group) => (
          <div key={group.title} className="glass-card skills-group-card">
            <h3 className="skills-group-title">
              <FiLayers className="inline-icon" />
              <span>{group.title}</span>
            </h3>

            <div className="skills-item-tags">
              {group.items.map((skill) => {
                const icon = skill.icon || (techIconMap && techIconMap[skill.name]);
                const isHovered = hoveredSkill === skill.name;

                return (
                  <div
                    key={skill.name}
                    className="skill-pill-wrap"
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className={`skill-pill ${isHovered ? "hovered" : ""}`}>
                      {icon ? (
                        <img
                          src={icon}
                          alt=""
                          className="skill-mini-icon"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="skill-dot" />
                      )}
                      <span className="skill-name">{skill.name}</span>
                      {skill.level && (
                        <span className="skill-level-tag">{skill.level}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
