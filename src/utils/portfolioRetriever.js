import {
  profile,
  socials,
  achievements,
  education,
  skillGroups,
  featuredProjects,
  additionalProjects,
} from "../content/site.js";

/**
 * Builds a canonical list of trusted link records strictly from site.js.
 * This is the single source of truth for URL validation and recommendation.
 */
export function getTrustedPortfolioLinks() {
  const links = [];

  // Project links
  const allProjects = [...featuredProjects, ...additionalProjects];
  allProjects.forEach((proj) => {
    (proj.links || []).forEach((link) => {
      if (link && link.href) {
        const isCode =
          link.label.toLowerCase().includes("code") ||
          link.label.toLowerCase().includes("repo") ||
          link.label.toLowerCase().includes("source");
        const isDemo =
          link.label.toLowerCase().includes("demo") ||
          link.label.toLowerCase().includes("live");

        const id = `proj_${proj.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${link.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

        links.push({
          id,
          project: proj.title,
          label: `${proj.title} (${link.label})`,
          shortLabel: `${proj.title} • ${link.label}`,
          url: link.href,
          type: isCode ? "github" : isDemo ? "demo" : "external",
        });
      }
    });
  });

  // Social links
  (socials || []).forEach((s) => {
    if (s && s.href) {
      links.push({
        id: `social_${s.id || s.label.toLowerCase()}`,
        label: `${s.label} (${s.handle || s.label})`,
        shortLabel: s.label,
        url: s.href,
        type: s.id === "github" ? "github" : s.id === "linkedin" ? "linkedin" : "social",
      });
    }
  });

  // Certificates & Achievements
  (achievements || []).forEach((ach, idx) => {
    if (ach && ach.link) {
      links.push({
        id: `cert_ach_${idx}`,
        label: `${ach.title} (Verified Credential)`,
        shortLabel: ach.title,
        url: ach.link,
        type: "certificate",
      });
    }
  });

  // Education Certificate links
  (education || []).forEach((edu, idx) => {
    if (edu && edu.certificateLink) {
      links.push({
        id: `cert_edu_${idx}`,
        label: `${edu.institution} Academic Credential`,
        shortLabel: `${edu.institution} Record`,
        url: edu.certificateLink,
        type: "certificate",
      });
    }
  });

  // Resume & Contact Email
  if (profile.resume) {
    links.push({
      id: "profile_resume",
      label: "Download Jit's Resume (PDF)",
      shortLabel: "Download Resume",
      url: profile.resume,
      type: "resume",
    });
  }

  if (profile.email) {
    links.push({
      id: "profile_email",
      label: `Email Jit (${profile.email})`,
      shortLabel: "Send Email",
      url: `mailto:${profile.email}`,
      type: "email",
    });
  }

  return links;
}

/**
 * Validates whether a given URL is strictly in the trusted portfolio list.
 */
export function isTrustedUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  const trusted = getTrustedPortfolioLinks();
  return trusted.some((t) => t.url === trimmed);
}

/**
 * Resolves an array of resource IDs into trusted link objects strictly from site.js.
 * Unrecognized or invalid IDs are ignored.
 */
export function resolveResourceIds(resourceIds) {
  if (!Array.isArray(resourceIds) || resourceIds.length === 0) return [];
  const trustedLinks = getTrustedPortfolioLinks();
  const resolved = [];

  for (const id of resourceIds) {
    if (typeof id !== "string") continue;
    const match = trustedLinks.find((tl) => tl.id === id.trim());
    if (match && !resolved.some((r) => r.id === match.id)) {
      resolved.push({
        id: match.id,
        label: match.label,
        shortLabel: match.shortLabel,
        url: match.url,
        type: match.type,
        project: match.project || null,
      });
    }
  }

  return resolved;
}

/**
 * Intelligent retrieval layer that searches existing portfolio data for information
 * relevant to the visitor's query and conversation history.
 */
export function retrievePortfolioContext(query, history = []) {
  const q = (query || "").toLowerCase().trim();
  const contextParts = [];
  const trustedLinks = getTrustedPortfolioLinks();

  // Combine query with previous turns for context
  const recentHistoryTexts = (history || [])
    .slice(-4)
    .map((h) => {
      if (typeof h.content === "string") return h.content.toLowerCase();
      if (typeof h.summary === "string") return h.summary.toLowerCase();
      return "";
    })
    .join(" ");

  const combinedQuery = `${recentHistoryTexts} ${q}`;
  const allProjects = [...featuredProjects, ...additionalProjects];

  // 1. Always include core identity
  contextParts.push(
    `CANDIDATE IDENTITY & BIO:\n` +
      `- Name: ${profile.name} (${profile.monogram})\n` +
      `- Role: ${profile.role}\n` +
      `- Headline: "${profile.headline}"\n` +
      `- Location: ${profile.location}\n` +
      `- Status / Availability: ${profile.availability}\n` +
      `- Email: ${profile.email}\n` +
      `- Key Focus: ${profile.stats.map((s) => `${s.label}: ${s.value}`).join(", ")}`
  );

  // 2. Detect Specific Technology mentions in query
  const techKeywords = [
    { key: "spring", label: "Spring Boot" },
    { key: "java", label: "Java" },
    { key: "react", label: "React" },
    { key: "kafka", label: "Apache Kafka" },
    { key: "keycloak", label: "Keycloak" },
    { key: "docker", label: "Docker" },
    { key: "mongo", label: "MongoDB" },
    { key: "postgres", label: "PostgreSQL" },
    { key: "sql", label: "SQL / Relational DBs" },
    { key: "websocket", label: "WebSocket & STOMP" },
    { key: "stomp", label: "WebSocket & STOMP" },
    { key: "jwt", label: "JWT & OAuth2" },
    { key: "microservice", label: "Microservices" },
    { key: "gemini", label: "Google Gemini API" },
  ];

  const matchedTechKeywords = techKeywords.filter((tk) => q.includes(tk.key));

  // 3. Project Matching
  // A. Check for ordinal project references (e.g. "second project", "2nd project", "first project")
  let ordinalProject = null;
  if (q.includes("first project") || q.includes("1st project")) {
    ordinalProject = allProjects[0];
  } else if (q.includes("second project") || q.includes("2nd project")) {
    ordinalProject = allProjects[1]; // Synapse
  } else if (q.includes("third project") || q.includes("3rd project")) {
    ordinalProject = allProjects[2]; // AI Fitness
  } else if (q.includes("fourth project") || q.includes("4th project")) {
    ordinalProject = allProjects[3]; // E-Commerce
  } else if (q.includes("fifth project") || q.includes("5th project")) {
    ordinalProject = allProjects[4]; // Email Sender
  }

  // B. Specific project name matching
  const matchedSpecificProjects = allProjects.filter((proj) => {
    const titleMatch = q.includes(proj.title.toLowerCase());
    const aliasMatch =
      (proj.title.includes("HireSphere") && q.includes("hire")) ||
      (proj.title.includes("Synapse") && q.includes("synapse")) ||
      (proj.title.includes("Fitness") && (q.includes("fitness") || q.includes("workout"))) ||
      (proj.title.includes("E-Commerce") && (q.includes("ecommerce") || q.includes("commerce") || q.includes("store"))) ||
      (proj.title.includes("Email") && (q.includes("email sender") || q.includes("mail app") || q.includes("mailer")));
    return titleMatch || aliasMatch;
  });

  // C. Reverse tech search across projects (e.g. "Which projects use Spring Boot?")
  const isReverseTechProjectQuery =
    (q.includes("which project") || q.includes("what project") || q.includes("projects use") || q.includes("uses")) &&
    matchedTechKeywords.length > 0;

  const techFilteredProjects = allProjects.filter((proj) => {
    if (!isReverseTechProjectQuery && matchedTechKeywords.length === 0) return false;
    return (proj.tech || []).some((t) => {
      const tLow = t.toLowerCase();
      return matchedTechKeywords.some((mt) => tLow.includes(mt.key));
    });
  });

  // D. Follow-up project query (e.g. "Which projects use them?", "Which projects use those technologies?")
  const isFollowUpProjectsQuery =
    (q.includes("which project") || q.includes("what project") || q.includes("projects use")) &&
    (q.includes("them") || q.includes("those") || q.includes("these") || q.includes("technologies") || q.includes("skills"));

  // E. General projects inquiry
  const isGeneralProjectQuery =
    q.includes("project") ||
    q.includes("work") ||
    q.includes("built") ||
    q.includes("portfolio") ||
    q.includes("apps");

  let projectsToInclude = [];
  if (ordinalProject) {
    projectsToInclude = [ordinalProject];
  } else if (matchedSpecificProjects.length > 0) {
    projectsToInclude = matchedSpecificProjects;
  } else if (isReverseTechProjectQuery && techFilteredProjects.length > 0) {
    projectsToInclude = techFilteredProjects;
  } else if (isFollowUpProjectsQuery || isGeneralProjectQuery) {
    projectsToInclude = allProjects;
  }

  if (projectsToInclude.length > 0) {
    const projDescriptions = projectsToInclude.map((p) => {
      const techList = (p.tech || []).join(", ");
      const archList = (p.architecture || []).map((a) => `    * ${a}`).join("\n");
      const linkList = (p.links || []).map((l) => `    * [${l.label}]: ${l.href}`).join("\n");

      return (
        `PROJECT: ${p.title} (${p.category})\n` +
        `  - Tagline: ${p.tagline}\n` +
        `  - Description: ${p.description}\n` +
        `  - Technologies: ${techList}\n` +
        `  - Architecture Highlights:\n${archList}\n` +
        `  - Available Project Links:\n${linkList}`
      );
    });

    contextParts.push(`PROJECT DATA:\n${projDescriptions.join("\n\n")}`);
  }

  // 4. Skills & Technologies Intent
  const isGeneralTechQuery =
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("skill") ||
    q.includes("language") ||
    q.includes("tool") ||
    q.includes("know") ||
    q.includes("backend") ||
    q.includes("frontend") ||
    q.includes("database");

  if (isGeneralTechQuery || matchedTechKeywords.length > 0 || (projectsToInclude.length === 0 && !q.includes("achievement") && !q.includes("cert") && !q.includes("education") && !q.includes("contact"))) {
    // If user asked about a specific tech, we can highlight it, but also provide categorized summary
    const skillSummary = skillGroups
      .map((group) => {
        const items = group.items.map((i) => `${i.name} (${i.level || "Proficient"})`).join(", ");
        return `- ${group.title} [Category: ${group.category}]: ${items}`;
      })
      .join("\n");

    // Also include practical application map
    const practicalMap = allProjects
      .map((p) => `- ${p.title}: ${(p.tech || []).join(", ")}`)
      .join("\n");

    contextParts.push(
      `TECHNICAL SKILLS & PROFICIENCY:\n${skillSummary}\n\nPRACTICAL APPLICATION ACROSS PROJECTS:\n${practicalMap}`
    );
  }

  // 5. Achievements, Certifications & Awards Intent
  const isAchievementQuery =
    combinedQuery.includes("achievement") ||
    combinedQuery.includes("cert") ||
    combinedQuery.includes("nptel") ||
    combinedQuery.includes("gold") ||
    combinedQuery.includes("silver") ||
    combinedQuery.includes("rank") ||
    combinedQuery.includes("award") ||
    combinedQuery.includes("score") ||
    combinedQuery.includes("top 1%");

  if (isAchievementQuery) {
    const achList = achievements
      .map((a, idx) => {
        return `- ID: cert_ach_${idx}\n  Title: ${a.title}\n  Details: ${a.subtitle}\n  Tag: ${a.tag}${a.link ? `\n  Verified URL: ${a.link}` : ""}`;
      })
      .join("\n\n");

    contextParts.push(`ACHIEVEMENTS & CERTIFICATIONS:\n${achList}`);
  }

  // 6. Education Intent
  const isEducationQuery =
    combinedQuery.includes("education") ||
    combinedQuery.includes("college") ||
    combinedQuery.includes("degree") ||
    combinedQuery.includes("btech") ||
    combinedQuery.includes("b.tech") ||
    combinedQuery.includes("school") ||
    combinedQuery.includes("grade") ||
    combinedQuery.includes("jis") ||
    combinedQuery.includes("academic") ||
    combinedQuery.includes("study") ||
    combinedQuery.includes("studied");

  if (isEducationQuery) {
    const eduList = education
      .map((e, idx) => {
        return `- Institution: ${e.institution}\n  Program: ${e.program} (${e.year})\n  Focus: ${e.focus}\n  Grade/Honors: ${e.grade}\n  Location: ${e.location}${e.certificateLink ? `\n  Academic Record ID: cert_edu_${idx}` : ""}`;
      })
      .join("\n\n");

    contextParts.push(`EDUCATION HISTORY:\n${eduList}`);
  }

  // 7. Contact, Socials, Resume Intent
  const isContactQuery =
    combinedQuery.includes("contact") ||
    combinedQuery.includes("email") ||
    combinedQuery.includes("reach") ||
    combinedQuery.includes("hire") ||
    combinedQuery.includes("social") ||
    combinedQuery.includes("github") ||
    combinedQuery.includes("linkedin") ||
    combinedQuery.includes("leetcode") ||
    combinedQuery.includes("resume") ||
    combinedQuery.includes("cv");

  if (isContactQuery || (projectsToInclude.length === 0 && !isGeneralTechQuery && !isAchievementQuery && !isEducationQuery)) {
    const socList = socials.map((s) => `- ${s.label} (ID: social_${s.id}): ${s.href} (Handle: ${s.handle})`).join("\n");
    contextParts.push(
      `CONTACT & SOCIAL CHANNELS:\n` +
        `- Email (ID: profile_email): ${profile.email}\n` +
        `- Resume (ID: profile_resume): ${profile.resume}\n` +
        `- Location: ${profile.location}\n` +
        `- Availability: ${profile.availability}\n` +
        `${socList}`
    );
  }

  return {
    contextText: contextParts.join("\n\n====================\n\n"),
    trustedLinks,
  };
}
