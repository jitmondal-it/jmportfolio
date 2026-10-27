export const skillCategories = [
  { id: "all", label: "All Skills" },
  { id: "backend", label: "Backend & Systems" },
  { id: "data", label: "Data & Persistence" },
  { id: "frontend", label: "Frontend & UI" },
];

export const skillGroups = [
  {
    title: "Backend & Architecture",
    category: "backend",
    items: [
      { name: "Java", icon: "/technology/java.png", level: "Core" },
      { name: "Spring Boot", icon: "/technology/spring.png", level: "Core" },
      { name: "Spring Security", level: "Production" },
      { name: "RESTful APIs", level: "Core" },
      { name: "Hibernate / JPA", level: "ORM" },
      { name: "JWT & OAuth2", level: "Auth" },
      { name: "Microservices", level: "Architecture" },
      { name: "WebSocket & STOMP", level: "Realtime" },
    ],
  },
  {
    title: "Distributed Systems & Cloud",
    category: "backend",
    items: [
      { name: "Apache Kafka", icon: "/technology/kafka.jpeg", level: "Event-driven" },
      { name: "Keycloak", icon: "/technology/keycloak.png", level: "IAM" },
      { name: "Docker", icon: "/technology/docker.png", level: "Containers" },
      { name: "Eureka Discovery", level: "Microservices" },
      { name: "API Gateway", level: "Routing" },
      { name: "Maven", icon: "/technology/maven.png", level: "Build" },
    ],
  },
  {
    title: "Data & Storage",
    category: "data",
    items: [
      { name: "PostgreSQL", icon: "/technology/postgresql.png", level: "Relational" },
      { name: "MongoDB", icon: "/technology/mongodb.png", level: "Document" },
      { name: "SQL Query Optimization", level: "Query" },
    ],
  },
  {
    title: "Frontend & Interface",
    category: "frontend",
    items: [
      { name: "React", icon: "/technology/react.png", level: "UI Library" },
      { name: "JavaScript", icon: "/technology/js.webp", level: "Language" },
      { name: "HTML5 / Semantic Web", icon: "/technology/html.jpg", level: "Structure" },
      { name: "CSS3 / Modern Layouts", icon: "/technology/css.png", level: "Styling" },
    ],
  },
];

export const techIconMap = {
  Java: "/technology/java.png",
  "Spring Boot": "/technology/spring.png",
  React: "/technology/react.png",
  "Tailwind CSS": "/technology/tailwind-css.webp",
  MongoDB: "/technology/mongodb.png",
  PostgreSQL: "/technology/postgresql.png",
  MySQL: "/technology/mysql.png",
  TypeScript: "/technology/typescript.jpeg",
  Docker: "/technology/docker.png",
  Maven: "/technology/maven.png",
  JavaScript: "/technology/js.webp",
  "JavaScript (ES6+)": "/technology/js.webp",
  "HTML5 / Semantic Web": "/technology/html.jpg",
  HTML5: "/technology/html.jpg",
  "CSS3 / Modern Layouts": "/technology/css.png",
  CSS3: "/technology/css.png",
  Keycloak: "/technology/keycloak.png",
  "Keycloak IAM": "/technology/keycloak.png",
  Postgres: "/technology/postgresql.png",
};
