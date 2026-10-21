import { education } from "../content/site";
import SectionIndex from "./SectionIndex";

const Education = () => {
  if (!education.length) return null;

  return (
    <section className="section-block" id="education">
      <div className="container">
        <SectionIndex number="05" label="Education" />
        <h2 className="section-title">Education</h2>
        <ul className="explore-list">
          {education.map((item) => (
            <li key={`${item.institution}-${item.year}`}>
              <strong>{item.institution}</strong>
              {item.program ? ` — ${item.program}` : ""}
              {item.year ? ` (${item.year})` : ""}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Education;
