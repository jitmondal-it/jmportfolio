const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
];

// Dynamically and safely resolve portfolio retriever with fallback for serverless environments
let cachedRetriever = null;

async function getPortfolioRetriever() {
  if (cachedRetriever) {
    return cachedRetriever;
  }

  try {
    const mod = await import("../src/utils/portfolioRetriever.js");
    if (typeof mod.retrievePortfolioContext === "function") {
      cachedRetriever = {
        retrievePortfolioContext: mod.retrievePortfolioContext,
        resolveResourceIds: mod.resolveResourceIds || (() => []),
      };
      return cachedRetriever;
    }
  } catch (err) {
    console.warn("Could not load ../src/utils/portfolioRetriever.js, using embedded fallback:", err.message);
  }

  // Fallback retriever ensuring the chatbot never crashes if src is absent in serverless lambda
  cachedRetriever = {
    retrievePortfolioContext: (query) => ({
      contextText: `CANDIDATE IDENTITY & BIO:
- Name: Jit Mondal (JM)
- Role: Java Backend Developer & Full-Stack Engineer
- Headline: "Java backend engineer architecting resilient APIs, distributed microservices, and reactive full-stack web applications with Spring Boot and React."
- Location: Murshidabad, West-Bengal
- Email: jitmondal631@gmail.com
- Availability: Available for engineering roles

CORE SKILLS:
- Backend: Java, Spring Boot, Spring Security, RESTful APIs, Hibernate / JPA, JWT & OAuth2, Microservices, WebSocket & STOMP
- Distributed & Cloud: Apache Kafka, Keycloak, Docker, Eureka Discovery, Spring Cloud Gateway, Maven
- Databases: PostgreSQL, MongoDB, SQL Query Optimization
- Frontend: React, JavaScript, HTML5, Tailwind CSS

KEY PROJECTS:
- HireSphere: Full-Stack Job & Talent Platform (React, TypeScript, Spring Boot, JWT, MongoDB).
- Synapse: Realtime Distributed Chat Platform (WebSocket & STOMP, SockJS, Spring Boot, MongoDB).
- AI Fitness Recommendation Engine: Event-driven microservices architecture featuring Spring Cloud Gateway (8080), Keycloak OAuth2, Apache Kafka event broker, User Service (8081, PostgreSQL), Activity Service (8082), and AI Service (8083, Google Gemini, MongoDB).`,
      trustedLinks: [
        { id: "github", label: "GitHub Profile", shortLabel: "GitHub", url: "https://github.com/jitmondal-it", type: "github" },
        { id: "linkedin", label: "LinkedIn Profile", shortLabel: "LinkedIn", url: "https://www.linkedin.com/in/jit-mondal-dev/", type: "linkedin" },
        { id: "leetcode", label: "LeetCode Profile", shortLabel: "LeetCode", url: "https://leetcode.com/u/Jit_Mondal2411/", type: "social" },
        { id: "profile_email", label: "Email Jit (jitmondal631@gmail.com)", shortLabel: "Send Email", url: "mailto:jitmondal631@gmail.com", type: "email" },
      ],
    }),
    resolveResourceIds: (ids) => {
      const fallbackList = [
        { id: "github", label: "GitHub Profile", shortLabel: "GitHub", url: "https://github.com/jitmondal-it", type: "github" },
        { id: "linkedin", label: "LinkedIn Profile", shortLabel: "LinkedIn", url: "https://www.linkedin.com/in/jit-mondal-dev/", type: "linkedin" },
        { id: "leetcode", label: "LeetCode Profile", shortLabel: "LeetCode", url: "https://leetcode.com/u/Jit_Mondal2411/", type: "social" },
        { id: "profile_email", label: "Email Jit (jitmondal631@gmail.com)", shortLabel: "Send Email", url: "mailto:jitmondal631@gmail.com", type: "email" },
      ];
      return (ids || []).map((id) => fallbackList.find((l) => l.id === id)).filter(Boolean);
    },
  };

  return cachedRetriever;
}

const SYSTEM_INSTRUCTION = `You are the professional AI portfolio assistant for Jit Mondal, a Java Backend Developer & Full-Stack Engineer.
Your role is to represent Jit to recruiters, hiring managers, engineering leaders, and peers.

CRITICAL RULES:
1. SOURCE OF TRUTH:
- You ONLY answer using the provided portfolio context for Jit Mondal.
- NEVER invent, extrapolate, or fabricate skills, achievements, project features, architecture details, experience, metrics, or URLs.
- If information is not in the portfolio data, state clearly: "I don't have that specific information in Jit's portfolio data."
- If the question is completely out of scope or unrelated, politely explain that you primarily answer questions about Jit's portfolio, skills, projects, education, achievements, and professional background.

2. RESPONSE FORMATS:
Always respond with valid JSON adhering strictly to this schema:
{
  "type": "skills" | "project" | "achievement" | "education" | "contact" | "resource" | "general" | "architecture",
  "title": "Title string (e.g. Technical Skills & Technology Stack, or Project Name — Category, or empty string for simple answers)",
  "summary": "Concise summary or direct answer (1-3 sentences)",
  "sections": [
    {
      "heading": "Section Heading",
      "items": ["Item or bullet point description"]
    }
  ],
  "resourceIds": [],
  "architectureDiagram": true | false
}

FORMAT GUIDELINES BY QUESTION TYPE:
A. TECHNOLOGY QUESTIONS (e.g. "What technologies does Jit use?"):
- type: "skills"
- title: "Technical Skills & Technology Stack"
- summary: One-sentence summary of Jit's technical focus (e.g., "Jit focuses on Java backend development, distributed microservices, and full-stack engineering with Spring Boot and React.")
- sections: Include ONLY relevant categories from:
  * "Backend & Architecture": Relevant technologies
  * "Frontend & UI": Relevant technologies
  * "Databases & Storage": Relevant technologies
  * "Infrastructure & Tools": Relevant technologies
  * "Practical Application": Mention relevant projects and explain briefly how their technologies are used, but only when supported by portfolio data.
* If the visitor asks about one specific technology (e.g. "Does Jit know Spring Boot?"), do NOT list the entire tech stack. Provide a focused answer with only the relevant category and projects.
* Do NOT display or trigger architecture diagrams for general technology questions.

B. PROJECT QUESTIONS (e.g. "Tell me about HireSphere.", "What is Synapse?"):
- type: "project"
- title: "[Project Name] — [Category]"
- summary: Brief overview explaining the project's purpose.
- sections: Include only sections supported by data:
  * "Key Features": Verified features from data.
  * "Technology Stack": Technologies used.
  * "Architecture & Implementation": Architecture details supported by data.
* For simple questions such as "What is Synapse?", provide a shorter direct answer instead of forcing every section.
* Do NOT display the Fitness AI architecture diagram for other projects like HireSphere or Synapse.

C. GENERAL FITNESS AI PROJECT QUESTIONS (e.g. "What is the Fitness AI project?", "Tell me about Jit's AI project."):
- type: "project"
- title: "AI Fitness Recommendation Engine — Event-Driven Microservices & AI"
- summary: Concise 1-2 sentence overview of the project's purpose and intelligent health recommendations.
- sections:
  * "Core Purpose": Real-time workout telemetry analysis and personalized AI health guidance.
  * "Architecture Highlights": Microservices topology coordinated with Spring Cloud Gateway, Kafka event bus, Keycloak authentication, and polyglot persistence (PostgreSQL & MongoDB).
  * "AI Integration": Google Gemini integration for overall analysis, improvement insights, suggestions, and safety guidance.
- architectureDiagram: false (the server will offer an optional view control without auto-expanding the diagram)

D. EXPLICIT ARCHITECTURE & SYSTEM DESIGN QUESTIONS (e.g. "Show me the architecture of the Fitness AI project.", "Explain the Fitness AI project architecture.", "How does the Fitness AI microservices architecture work?", "How do the services communicate?"):
- type: "architecture"
- title: "AI Fitness Recommendation Engine — Microservices Architecture"
- summary: Concise explanation of the distributed, event-driven topology coordinated via Spring Cloud, Keycloak, Apache Kafka, and Google Gemini AI.
- sections: Organize clearly into:
  * "Frontend and authentication": React web application, Keycloak OIDC/OAuth2 authentication, User sync filter in API Gateway.
  * "API Gateway and security": Spring Cloud Gateway (port 8080) reverse proxy, route security with JWT validation, request dispatch.
  * "User and Activity services": User Service (port 8081) with PostgreSQL User database via UserRepo; Activity Service (port 8082) with Activity database and User validation API.
  * "Inter-service communication and Kafka": Synchronous REST for direct gateway routing and user validation; asynchronous Apache Kafka event broker for workout events.
  * "AI processing and Gemini integration": AI Service (port 8083) Activity listener consuming Kafka events, Gemini client (GeminiService.java) generating structured 4-tier recommendations (Overall, Improvements, Suggestions, Safety).
  * "Recommendation persistence and retrieval": Storing recommendations in MongoDB, served via Recommendation Service and Recommendation API to Frontend.
  * "Configuration and service discovery": Spring Cloud Config Server (port 8888) and Netflix Eureka (port 8761).
- architectureDiagram: true

E. COMPONENT-SPECIFIC FITNESS AI QUESTIONS (e.g. "How does Keycloak authentication work?", "Explain the authentication flow.", "How does Gemini generate recommendations?"):
- type: "architecture" or "project"
- title: Focused title (e.g. "Fitness AI — Keycloak Authentication & Security Flow" or "Fitness AI — Gemini Recommendation Workflow")
- summary: Focused explanation detailing the specific flow and how it connects with downstream services.
- sections: Clear step-by-step breakdown supported by verified project documentation.
- architectureDiagram: true

F. ACHIEVEMENTS QUESTIONS (e.g. "What are Jit's achievements?"):
- type: "achievement"
- title: "Achievements & Certifications"
- summary: Brief one-sentence overview.
- sections:
  * "Verified Honors": Exact achievement names, rankings, and details.

G. EDUCATION QUESTIONS (e.g. "Where did Jit study?"):
- type: "education"
- title: "Education"
- summary: Brief overview of Jit's academic background.
- sections:
  * "Academic History": Formatted items with Institution, Qualification/Program, and Expected Graduation / Year.

H. CONTACT QUESTIONS (e.g. "How can I contact Jit?"):
- type: "contact"
- title: "Contact Information"
- summary: Direct statement on how to reach Jit.
- sections:
  * "Channels": Exact email address (jitmondal631@gmail.com) and social profiles from the portfolio data.

I. SIMPLE FACTUAL QUESTIONS:
- type: "general"
- title: ""
- summary: Direct, factual 1 to 3 sentence response.
- sections: []

3. LINK BEHAVIOR — VERY STRICT:
- DEFAULT TO NO LINKS: "resourceIds" MUST BE EMPTY [] BY DEFAULT.
- Do NOT include resource IDs for general explanations of projects, skills, or achievements.
- ONLY populate "resourceIds" when the visitor EXPLICITLY asks for a link, repository, source code, live demo, certificate, or profile link (e.g. "Give me the repository for Synapse", "Show me Jit's Java certificate", "Link to his LinkedIn").
- When explicitly requested, only include matching IDs from the VERIFIED RESOURCE IDS list provided in context.
- NEVER invent or generate arbitrary URLs or IDs. If the requested link is unavailable, explain that it is unavailable and keep "resourceIds" as [].`;

/**
 * Builds a markdown string from structured JSON as a fallback.
 */
function buildMarkdownFromStructured(structured) {
  if (!structured) return "";
  const parts = [];
  if (structured.title) {
    parts.push(`### ${structured.title}`);
  }
  if (structured.summary) {
    parts.push(structured.summary);
  }
  if (Array.isArray(structured.sections)) {
    for (const sec of structured.sections) {
      if (sec.heading) {
        parts.push(`**${sec.heading}**`);
      }
      if (Array.isArray(sec.items)) {
        for (const item of sec.items) {
          parts.push(`- ${item}`);
        }
      }
    }
  }
  return parts.join("\n\n");
}

/**
 * Main serverless function handler compatible with Vercel and local dev server.
 */
export default async function handler(req, res) {
  // CORS & Method support
  if (req.method === "OPTIONS") {
    res.writeHead?.(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end ? res.end() : res.status(200).send("");
  }

  if (req.method !== "POST") {
    const errorBody = { error: "Method not allowed. Use POST." };
    if (res.status) {
      return res.status(405).json(errorBody);
    }
    res.writeHead?.(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(errorBody));
  }

  // Parse request body
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      const errRes = { error: "Invalid JSON body." };
      return res.status ? res.status(400).json(errRes) : res.end(JSON.stringify(errRes));
    }
  } else if (typeof Buffer !== "undefined" && Buffer.isBuffer(body)) {
    try {
      body = JSON.parse(body.toString("utf-8"));
    } catch {
      const errRes = { error: "Invalid JSON body." };
      return res.status ? res.status(400).json(errRes) : res.end(JSON.stringify(errRes));
    }
  }

  const message = (body?.message || "").trim();
  const rawHistory = Array.isArray(body?.history) ? body.history : [];

  // Input validation
  if (!message) {
    const errRes = { error: "Message is required." };
    return res.status ? res.status(400).json(errRes) : res.end(JSON.stringify(errRes));
  }

  if (message.length > 1000) {
    const errRes = { error: "Message is too long (maximum 1000 characters)." };
    return res.status ? res.status(400).json(errRes) : res.end(JSON.stringify(errRes));
  }

  // Check API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    const configNotice = {
      reply:
        "⚠️ **Gemini API key is not configured.**\n\nTo activate live AI responses:\n1. Create a key at [Google AI Studio](https://aistudio.google.com/).\n2. Add `GEMINI_API_KEY=your_key` to your `.env` file (and to Vercel Environment Variables if deployed).\n3. Restart the dev server.",
      suggestedLinks: [],
      isConfigNotice: true,
    };
    return res.status ? res.status(200).json(configNotice) : res.end(JSON.stringify(configNotice));
  }

  try {
    const { retrievePortfolioContext, resolveResourceIds } = await getPortfolioRetriever();

    // 1. Retrieve structured portfolio context & trusted links
    const { contextText, trustedLinks } = retrievePortfolioContext(message, rawHistory);

    const availableResourceList = (trustedLinks || [])
      .map((l) => `- ${l.id}: ${l.label}`)
      .join("\n");

    // 2. Build alternating history turns for Gemini
    const sanitizedTurns = [];
    const recentHistory = rawHistory.slice(-6); // Limit to last 6 messages

    for (const item of recentHistory) {
      const text = (item.content || item.text || item.summary || "").trim();
      if (!text) continue;
      const role = item.role === "assistant" || item.role === "model" ? "model" : "user";

      // Enforce alternating turns
      if (sanitizedTurns.length === 0 && role === "model") {
        continue;
      }
      if (sanitizedTurns.length > 0 && sanitizedTurns[sanitizedTurns.length - 1].role === role) {
        continue;
      }
      sanitizedTurns.push({
        role,
        parts: [{ text: text.slice(0, 1500) }],
      });
    }

    // 3. Current prompt with verified context and resource IDs
    const userPromptWithContext =
      `=== VERIFIED PORTFOLIO CONTEXT ===\n${contextText}\n\n` +
      `=== VERIFIED RESOURCE IDS (Only cite in "resourceIds" if visitor EXPLICITLY asks for a link/repo/demo/certificate/profile) ===\n${availableResourceList}\n\n` +
      `=== VISITOR QUESTION ===\n${message}`;

    sanitizedTurns.push({
      role: "user",
      parts: [{ text: userPromptWithContext }],
    });

    // 4. Call Gemini REST API with fallback models
    async function callGemini(modelName) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(`${GEMINI_API_URL}/${modelName}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            contents: sanitizedTurns,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.15,
              maxOutputTokens: 2048,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    }

    const modelsToTry = [DEFAULT_MODEL, ...FALLBACK_MODELS.filter((m) => m !== DEFAULT_MODEL)].slice(0, 3);
    let geminiRes = null;

    for (const modelName of modelsToTry) {
      try {
        geminiRes = await callGemini(modelName);
        if (geminiRes.ok) break;
        if (geminiRes.status === 404 || geminiRes.status === 503 || geminiRes.status === 429) {
          console.warn(`Model ${modelName} returned ${geminiRes.status}, trying fallback...`);
          continue;
        }
        break;
      } catch (callErr) {
        console.warn(`Call to ${modelName} failed:`, callErr.message);
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      let errorMsg = "Gemini API request failed.";
      const status = geminiRes ? geminiRes.status : 503;
      if (status === 429) {
        errorMsg = "AI rate limit reached. Please wait a moment and try again.";
      } else if (status === 403 || status === 401) {
        errorMsg = "Gemini API authentication failed. Please check your GEMINI_API_KEY.";
      }

      const errPayload = {
        error: errorMsg,
        reply: `⚠️ ${errorMsg}`,
        suggestedLinks: [],
      };
      return res.status ? res.status(status).json(errPayload) : res.end(JSON.stringify(errPayload));
    }

    const data = await geminiRes.json();
    const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // 5. Parse and validate structured response
    let structured = null;
    try {
      structured = JSON.parse(rawOutput);
    } catch {
      structured = {
        type: "general",
        title: "",
        summary: rawOutput || "I couldn't generate a response. Please try rephrasing your question.",
        sections: [],
        resourceIds: [],
      };
    }

    // Ensure resourceIds is an array
    if (!Array.isArray(structured.resourceIds)) {
      structured.resourceIds = [];
    }

    // Resolve resource IDs strictly from trusted portfolio data
    const suggestedLinks = resolveResourceIds(structured.resourceIds);

    // Attach verified architecture diagram for relevant Fitness AI questions
    const qLower = message.toLowerCase();

    const isFitnessQuery =
      qLower.includes("fitness") ||
      qLower.includes("workout") ||
      qLower.includes("ai project") ||
      qLower.includes("keycloak") ||
      qLower.includes("authentication flow") ||
      (qLower.includes("services") && qLower.includes("communicate")) ||
      (qLower.includes("gemini") && (qLower.includes("recommend") || qLower.includes("generate") || qLower.includes("ai"))) ||
      (qLower.includes("kafka") && (qLower.includes("event") || qLower.includes("communicate") || qLower.includes("stream")));

    const isExplicitArchitecture =
      qLower.includes("architecture") ||
      qLower.includes("system design") ||
      qLower.includes("diagram") ||
      qLower.includes("topology") ||
      qLower.includes("microservices architecture") ||
      (qLower.includes("services") && qLower.includes("communicate"));

    const isAuthFlow =
      qLower.includes("keycloak") ||
      qLower.includes("authentication flow");

    const isGeminiFlow =
      qLower.includes("how does gemini generate") ||
      (qLower.includes("gemini") && qLower.includes("recommendation"));

    const isGeneralFitnessOverview =
      (qLower.includes("what is the fitness") ||
        qLower.includes("tell me about jit's ai project") ||
        qLower.includes("tell me about the fitness")) &&
      !isExplicitArchitecture;

    const TRUSTED_DIAGRAM_SRC = "/project/fitnessai-architecture.png";
    const TRUSTED_DIAGRAM_ALT =
      "AI Fitness Recommendation Engine Microservices Architecture Diagram illustrating React frontend, Keycloak, Spring Cloud API Gateway, User Service, Activity Service, Apache Kafka, AI Service with Google Gemini, Config Server, and Eureka Service Discovery.";
    const TRUSTED_DIAGRAM_TITLE = "AI Fitness Recommendation Engine — System Architecture";
    const TRUSTED_DIAGRAM_CAPTION =
      "Event-driven microservices topology featuring React, Keycloak, Spring Cloud Gateway, Kafka, and Google Gemini.";

    if (
      structured.type === "architecture" ||
      structured.architectureDiagram === true ||
      (isFitnessQuery && (isExplicitArchitecture || isAuthFlow))
    ) {
      structured.diagram = {
        src: TRUSTED_DIAGRAM_SRC,
        alt: TRUSTED_DIAGRAM_ALT,
        title: TRUSTED_DIAGRAM_TITLE,
        caption: TRUSTED_DIAGRAM_CAPTION,
        displayMode: "inline",
      };
    } else if (isFitnessQuery && (isGeneralFitnessOverview || isGeminiFlow || qLower.includes("fitness"))) {
      structured.diagram = {
        src: TRUSTED_DIAGRAM_SRC,
        alt: TRUSTED_DIAGRAM_ALT,
        title: TRUSTED_DIAGRAM_TITLE,
        caption: TRUSTED_DIAGRAM_CAPTION,
        displayMode: "optional",
      };
    }

    // Build fallback reply string for any markdown consumer
    const replyText = buildMarkdownFromStructured(structured) || structured.summary || "";

    const responsePayload = {
      structured,
      reply: replyText,
      suggestedLinks,
    };

    if (res.status) {
      return res.status(200).json(responsePayload);
    }
    res.writeHead?.(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(responsePayload));
  } catch (err) {
    console.error("Chatbot server error:", err.message);
    const isTimeout = err.name === "AbortError";
    const statusCode = isTimeout ? 504 : 500;
    const errorPayload = {
      error: isTimeout ? "Request timed out." : "Internal server error.",
      reply: isTimeout
        ? "⚠️ The request timed out while connecting to the AI service. Please try again."
        : "⚠️ An error occurred while generating a response. Please try again shortly.",
      suggestedLinks: [],
    };

    if (res.headersSent) {
      return;
    }

    if (res.status && typeof res.status(statusCode).json === "function") {
      return res.status(statusCode).json(errorPayload);
    }
    if (res.setHeader) {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = statusCode;
      return res.end(JSON.stringify(errorPayload));
    }
    res.writeHead?.(statusCode, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(errorPayload));
  }
}
