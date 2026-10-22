export const profile = {
  name: "Jit Mondal",
  monogram: "JM",
  role: "Java Backend Developer | Full-Stack Engineer",
  headline:
    "Java backend engineer architecting resilient APIs, distributed microservices, and reactive full-stack web applications with Spring Boot and React.",
  portrait: "/j-pic.jpeg",
  resume: "/Jit Mondal CV.pdf",
  email: "jitmondal631@gmail.com",
  location: "Murshidabad, West-Bengal",
  availability: "Available for engineering roles",
  stats: [
    { label: "Core Focus", value: "Java & Spring Boot" },
    { label: "Architecture", value: "Distributed & REST" },
  ],
};

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/jitmondal-it",
    id: "github",
    handle: "jitmondal-it",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jit-mondal-dev/",
    id: "linkedin",
    handle: "in/jit-mondal-dev",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/Jit_Mondal2411/",
    id: "leetcode",
    handle: "Jit_Mondal2411",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const achievements = [
  {
    title: "Top 1% in NPTEL Java Programming",
    subtitle: "NPTEL – Programming in Java (IIT Kharagpur) Top 1% (Elite + Gold Certificate)",
    tag: "Certification",
    link: "https://drive.google.com/file/d/13wRpVd6JWkmFvSWWCdLb_mVzh_t4YV8l/view?usp=sharing", // Paste your certificate URL here (e.g., https://archive.nptel.ac.in/... or /your-cert.pdf)
  },
  {
    title: "Top 1% in NPTEL Machine Learning",
    subtitle: "NPTEL – Introduction to Machine Learning (IIT Madras) Top 1% (Elite + Silver Certificate)",
    tag: "Certification",
    link: "https://drive.google.com/file/d/1mqsDQ6R4D8WHZUQN7Dbu04uWIaMUA2J-/view?usp=sharing", // Paste your certificate URL here
  },
  {
    title: "Ranked 1st in IT Dept",
    subtitle: "Secured 1st position in the IT Department (2nd Year), Academic Session 2024–2025 JIS College of Engineering",
    tag: "Ranked 1st in IT Dept",
    link: "https://drive.google.com/file/d/1410g9N7DA4Mz3Hl_Cq-Q2xTMWYcg3bPT/view?usp=sharing", // Optional link
  },
];

export const education = [
  {
    institution: "JIS College of Engineering",
    program: "Bachelor of Technology in Information Technology (B.Tech)",
    year: "2023 – Expected 2027",
    focus: "Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks",
    grade: "Ranked 1st in IT Department (2nd Year)",
    certificateLink: "https://drive.google.com/file/d/1410g9N7DA4Mz3Hl_Cq-Q2xTMWYcg3bPT/view?usp=sharing",
    type: "Undergraduate Degree",
    location: "Kalyani, West Bengal",
  },
  {
    institution: "Sainthia Town High School",
    program: "Pure Science Stream (WBCHSE)",
    year: "2021 – 2023",
    focus: "Physics, Chemistry, Mathematics",
    grade: "87.8% in Class XII",
    certificateLink: "", // Paste your Class XII certificate or marksheet link here
    type: "Higher Secondary Education",
    location: "West Bengal",
  },
  {
    institution: "Ekpaharia High School",
    program: "WBBSE",
    year: "Completed 2021",
    focus: "Mathematics, Physical Science, Life Science, Indian History, English, Bengali",
    grade: "92% in Class X",
    certificateLink: "", // Paste your Class X certificate or marksheet link here
    type: "SECONDARY EDUCATION",
    location: "West Bengal",
  },
];

export const skillCategories = [
  { id: "all", label: "All Skills" },
  { id: "backend", label: "Backend & Systems" },
  { id: "data", label: "Data & Persistence" },
  { id: "frontend", label: "Frontend & UI" },
  { id: "tools", label: "Tools & Practice" },
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

export const featuredProjects = [
  {
    title: "HireSphere",
    category: "Full-Stack Job & Talent Platform",
    status: "live",
    tagline: "End-to-end recruitment platform with dual seeker/recruiter dashboards",
    description:
      "A comprehensive job portal where candidates discover, filter, and apply for openings, while recruiters publish listings and track candidate workflows. Built with a decoupled architecture featuring JWT security, structured role-based access, and flexible document persistence.",
    architecture: [
      "Secure authentication using JWT and Spring Security with role-based access control (RBAC)",
      "REST APIs with DTO validation and centralized exception handling",
      "MongoDB queries for retrieving job listings and candidate information",
      "Reusable React and TypeScript components styled with Mantine UI and Tailwind CSS",
    ],
    tech: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Mantine UI",
      "Spring Boot",
      "JWT",
      "MongoDB",
    ],
    image: "/Project-3.png",
    links: [
      {
        label: "Live Demo",
        href: "https://hire-sphere-frontend-cs5a.vercel.app/",
        featured: true,
      },
      {
        label: "Frontend Code",
        href: "https://github.com/jitmondal-it/HireSphere-Frontend",
      },
      {
        label: "Backend Code",
        href: "https://github.com/jitmondal-it/HireSphere-Backend",
      },
    ],
  },
  {
    title: "Synapse",
    category: "Realtime Distributed Chat Platform",
    status: "live",
    tagline: "Room-based instantaneous messaging powered by WebSocket & STOMP",
    description:
      "A realtime communication application enabling multi-user topic rooms with instant broadcast message distribution. Leverages WebSocket STOMP protocol and SockJS fallback over Spring Boot, with MongoDB for chat room history persistence and a responsive React UI.",
    architecture: [
      "Full-duplex WebSocket connection with STOMP protocol and SockJS fallback",
      "Spring Boot message broker routing topic messages to subscribed room channels",
      "MongoDB persistence for structured room configurations and message logs",
      "Clean React interface styled with Tailwind CSS and Material UI components",
    ],
    tech: [
      "Spring Boot",
      "WebSocket",
      "STOMP",
      "SockJS",
      "MongoDB",
      "React",
      "Tailwind CSS",
      "Material UI",
    ],
    image: "/Project-4.png",
    links: [
      {
        label: "Live Demo",
        href: "https://synapse-chat-application-frontend.vercel.app",
        featured: true,
      },
      {
        label: "Frontend Code",
        href: "https://github.com/jitmondal-it/Synapse-chat-application-frontend",
      },
      {
        label: "Backend Code",
        href: "https://github.com/jitmondal-it/Synapse-chat-application-backend",
      },
    ],
  },
  {
    title: "AI Fitness Recommendation Engine",
    category: "Event-Driven Microservices & AI",
    status: "live",
    tagline: "Gemini-driven health analytics with Kafka asynchronous event streaming",
    description:
      "An intelligent workout analysis and health recommendation platform built on a distributed microservices pattern. Analyzes user workout telemetry with Google Gemini API to generate personalized performance, recovery, and injury prevention insights.",
    architecture: [
      "Distributed microservices topology coordinated with Spring Cloud Gateway & Eureka",
      "Apache Kafka event bus for asynchronous workout report ingestion and worker processing",
      "Keycloak integration for centralized OAuth2 / OpenID Connect identity federation",
      "Polyglot data storage: PostgreSQL for user telemetry and MongoDB for AI insights",
    ],
    tech: [
      "Java",
      "Spring Boot",
      "Microservices",
      "Apache Kafka",
      "Keycloak",
      "Docker",
      "Google Gemini API",
      "MongoDB",
      "PostgreSQL",
      "React",
    ],
    image: "/Project-5.png",
    links: [
      {
        label: "Microservices Repo",
        href: "https://github.com/jitmondal-it/fitness-ai-recommendation-microservices",
      },
      {
        label: "Frontend Repo",
        href: "https://github.com/jitmondal-it/fitness-ai-frontend",
      },
    ],
  },
];

export const additionalProjects = [
  {
    title: "E-Commerce Platform",
    category: "Full-Stack Storefront & Commerce",
    status: "live",
    tagline: "Scalable online retail architecture with secure checkout and catalog workflows",
    description:
      "A complete e-commerce solution with product catalog browsing, secure user authentication, shopping cart management, and order processing workflows. Features structured PostgreSQL schemas with transactional consistency.",
    architecture: [
      "Role-based authentication & JWT token authorization with Spring Security",
      "PostgreSQL relational schema with optimized indexing for catalog search & checkout",
      "Decoupled RESTful inventory endpoints with comprehensive request validation",
      "Responsive React storefront UI styled with modern Tailwind CSS utilities",
    ],
    tech: ["Spring Boot", "React", "PostgreSQL", "Tailwind CSS"],
    image: "/project-2.jpg",
    links: [
      {
        label: "Source Code",
        href: "https://github.com/jitmondal-it/ecommerce-project",
        featured: true,
      },
    ],
  },
  {
    title: "Email Sender Application",
    category: "Cloud Integration & Mail Service",
    status: "live",
    tagline: "High-throughput mail delivery service with Google OAuth2 & Gmail API",
    description:
      "Production-ready mail delivery application integrating Google OAuth2 and the Gmail API to send rich HTML emails with file attachments, status tracking, and automated validation.",
    architecture: [
      "Google OAuth2 integration for secure API authorization with Gmail service",
      "Spring Boot asynchronous mail dispatching supporting HTML templates and MIME attachments",
      "RESTful API endpoints for programmatic email triggering with delivery logging",
      "Dynamic frontend interface with real-time feedback and validation",
    ],
    tech: ["Spring Boot", "React", "Google OAuth2", "Gmail API"],
    image: "/EmailSender.png",
    links: [
      {
        label: "Source Code",
        href: "https://github.com/jitmondal-it/email-sender-application",
        featured: true,
      },
    ],
  },
];
