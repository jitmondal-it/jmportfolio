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
    architectureDiagram: "/project/fitnessai-architecture.png",
    architectureComponents: {
      frontend: "React client communicating with API Gateway and Keycloak identity provider",
      authentication: "Centralized Keycloak OAuth2 / OpenID Connect token authentication with API Gateway JWT security",
      apiGateway: "Spring Cloud Gateway (port 8080) providing route security, user synchronization filter, and downstream dispatch",
      userService: "User Service (port 8081) with PostgreSQL User database persistence via UserRepo",
      activityService: "Activity Service (port 8082) with user validation and event publication to Kafka",
      messageBroker: "Apache Kafka event bus for asynchronous activity event ingestion and worker processing",
      aiService: "AI Service (port 8083) consuming Kafka events and orchestrating Gemini AI analysis",
      geminiIntegration: "Gemini client (GeminiService.java) generating structured 4-tier recommendations (Overall, Improvements, Suggestions, Safety)",
      recommendationService: "Recommendation Service and API storing insights in MongoDB and serving client queries",
      platform: "Spring Cloud Config server (port 8888) and Netflix Eureka Service Discovery (port 8761)",
    },
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

export const allProjects = [...featuredProjects, ...additionalProjects];

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "fullstack", label: "Full-Stack", match: ["Full-Stack", "Storefront"] },
  { id: "microservices", label: "Microservices & Systems", match: ["Microservices", "AI", "Distributed"] },
  { id: "realtime", label: "Realtime & Cloud", match: ["Realtime", "Cloud", "WebSocket"] },
  { id: "algorithms", label: "Algorithms & DSA", match: ["Algorithmic", "DSA"] },
];
