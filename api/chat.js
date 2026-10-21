import {
  retrievePortfolioContext,
  resolveResourceIds,
} from "../src/utils/portfolioRetriever.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const FALLBACK_MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
];

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
  "type": "skills" | "project" | "achievement" | "education" | "contact" | "resource" | "general",
  "title": "Title string (e.g. Technical Skills & Technology Stack, or Project Name — Category, or empty string for simple answers)",
  "summary": "Concise summary or direct answer (1-3 sentences)",
  "sections": [
    {
      "heading": "Section Heading",
      "items": ["Item or bullet point description"]
    }
  ],
  "resourceIds": []
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

B. PROJECT QUESTIONS (e.g. "Tell me about HireSphere."):
- type: "project"
- title: "[Project Name] — [Category]"
- summary: Brief overview explaining the project's purpose.
- sections: Include only sections supported by data:
  * "Key Features": Verified features from data.
  * "Technology Stack": Technologies used.
  * "Architecture & Implementation": Architecture details supported by data.
* For simple questions such as "What is Synapse?", provide a shorter direct answer instead of forcing every section.

C. ACHIEVEMENTS QUESTIONS (e.g. "What are Jit's achievements?"):
- type: "achievement"
- title: "Achievements & Certifications"
- summary: Brief one-sentence overview.
- sections:
  * "Verified Honors": Exact achievement names, rankings, and details (e.g. Top 1% in NPTEL Java Programming Elite + Gold, Top 1% in NPTEL Machine Learning Elite + Silver, Ranked 1st in IT Dept 2nd Year JIS College).

D. EDUCATION QUESTIONS (e.g. "Where did Jit study?"):
- type: "education"
- title: "Education"
- summary: Brief overview of Jit's academic background.
- sections:
  * "Academic History": Formatted items with Institution, Qualification/Program, and Expected Graduation / Year.

E. CONTACT QUESTIONS (e.g. "How can I contact Jit?"):
- type: "contact"
- title: "Contact Information"
- summary: Direct statement on how to reach Jit.
- sections:
  * "Channels": Exact email address (jitmondal631@gmail.com) and social profiles from the portfolio data.

F. SIMPLE FACTUAL QUESTIONS:
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
        "⚠️ **Gemini API key is not configured.**\n\nTo activate live AI responses:\n1. Create a key at [Google AI Studio](https://aistudio.google.com/).\n2. Add `GEMINI_API_KEY=your_key` to your `.env` file.\n3. Restart the dev server.",
      suggestedLinks: [],
      isConfigNotice: true,
    };
    return res.status ? res.status(200).json(configNotice) : res.end(JSON.stringify(configNotice));
  }

  try {
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
      const timeoutId = setTimeout(() => controller.abort(), 35000);

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

    const modelsToTry = [DEFAULT_MODEL, ...FALLBACK_MODELS.filter((m) => m !== DEFAULT_MODEL)];
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
    const errorPayload = {
      error: isTimeout ? "Request timed out." : "Internal server error.",
      reply: isTimeout
        ? "⚠️ The request timed out while connecting to the AI service. Please try again."
        : "⚠️ An error occurred while generating a response. Please try again shortly.",
      suggestedLinks: [],
    };

    if (res.status) {
      return res.status(isTimeout ? 504 : 500).json(errorPayload);
    }
    res.writeHead?.(isTimeout ? 504 : 500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(errorPayload));
  }
}
