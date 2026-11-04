import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiX,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiAward,
  FiMail,
  FiFileText,
  FiRotateCcw,
  FiMaximize2,
  FiZoomIn,
  FiZoomOut,
  FiLayers,
} from "react-icons/fi";
import Bot3D from "./Bot3D";
import { isTrustedUrl } from "../../utils/portfolioRetriever";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import "./AIChatBot.css";

const STARTER_QUESTIONS = [
  "What technologies does Jit use?",
  "Tell me about his projects.",
  "Explain the AI Fitness Recommendation Engine.",
  "What are Jit's achievements?",
  "How can I contact Jit?",
];

const INITIAL_MESSAGE = {
  id: "welcome-msg",
  role: "assistant",
  content: `Hi there! 👋 I'm **Jit's AI Assistant**.\n\nI can answer questions about Jit's background as a Java Backend & Full-Stack Engineer, his microservices and distributed systems architectures, key projects like **HireSphere** and **Synapse**, technical skills, verified certifications, or how to reach him.\n\nWhat would you like to explore?`,
  suggestedLinks: [],
};

/**
 * Renders formatted assistant text with strict URL verification.
 * Any link not verified against portfolio data is rendered safely as plain text.
 */
const SafeFormattedText = ({ content }) => {
  if (!content) return null;

  // Split into paragraphs / blocks
  const lines = content.split("\n");
  const blocks = [];
  let currentList = null;

  const parseInline = (text) => {
    // Regex matches:
    // 1. Markdown links: [label](url)
    // 2. Bold text: **bold**
    // 3. Inline code: `code`
    const regex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.slice(lastIdx, match.index));
      }

      if (match[1]) {
        // Markdown Link
        const label = match[2];
        const url = match[3];
        if (isTrustedUrl(url)) {
          parts.push(
            <a
              key={match.index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-chat-verified-link"
            >
              {label}
            </a>
          );
        } else {
          // Untrusted / unrecognized URL -> strip into plain text
          parts.push(label);
        }
      } else if (match[4]) {
        // Bold
        parts.push(<strong key={match.index}>{match[5]}</strong>);
      } else if (match[6]) {
        // Code
        parts.push(<code key={match.index}>{match[7]}</code>);
      }

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.slice(lastIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (currentList) {
        blocks.push(<ul key={`list-${index}`}>{currentList}</ul>);
        currentList = null;
      }
      return;
    }

    // List item check: * or -
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const itemText = trimmed.replace(/^[-*]\s+/, "");
      const li = <li key={`li-${index}`}>{parseInline(itemText)}</li>;
      if (!currentList) {
        currentList = [li];
      } else {
        currentList.push(li);
      }
      return;
    }

    // Close any open list
    if (currentList) {
      blocks.push(<ul key={`list-${index}`}>{currentList}</ul>);
      currentList = null;
    }

    // Header check
    if (trimmed.startsWith("### ")) {
      blocks.push(
        <strong key={`h3-${index}`} className="block text-ink font-semibold mt-2 mb-1">
          {parseInline(trimmed.replace(/^###\s+/, ""))}
        </strong>
      );
      return;
    }

    blocks.push(<p key={`p-${index}`}>{parseInline(trimmed)}</p>);
  });

  if (currentList) {
    blocks.push(<ul key="list-end">{currentList}</ul>);
  }

  return <>{blocks}</>;
};

/**
 * Renders the Fitness AI architecture diagram thumbnail or optional view button.
 */
const ArchitectureDiagramCard = ({ diagram, onOpenDiagram }) => {
  if (!diagram || !diagram.src) return null;
  const isInline = diagram.displayMode === "inline";

  if (!isInline) {
    return (
      <div className="ai-chat-diagram-optional-box">
        <button
          type="button"
          className="ai-chat-diagram-view-btn"
          onClick={(e) => onOpenDiagram?.(diagram, e)}
          aria-label="View Fitness AI microservices architecture diagram in full screen"
        >
          <FiLayers className="ai-chat-diagram-btn-icon" aria-hidden="true" />
          <span>View Architecture Diagram</span>
          <FiMaximize2 className="ai-chat-diagram-btn-ext" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="ai-chat-diagram-card">
      <div className="ai-chat-diagram-header">
        <span className="ai-chat-diagram-badge">
          <FiLayers aria-hidden="true" />
          <span>Microservices Architecture</span>
        </span>
        <button
          type="button"
          className="ai-chat-diagram-expand-btn"
          onClick={(e) => onOpenDiagram?.(diagram, e)}
          aria-label="Open architecture diagram in full screen"
          title="Open full screen lightbox"
        >
          <FiMaximize2 aria-hidden="true" />
          <span>Expand</span>
        </button>
      </div>

      <button
        type="button"
        className="ai-chat-diagram-preview-btn"
        onClick={(e) => onOpenDiagram?.(diagram, e)}
        aria-label="Click to enlarge architecture diagram in lightbox"
        title="Click to view full-resolution diagram"
      >
        <img
          src={diagram.src}
          alt={diagram.alt || "AI Fitness Recommendation Engine Architecture Diagram"}
          className="ai-chat-diagram-img"
          loading="lazy"
        />
        <div className="ai-chat-diagram-overlay">
          <FiZoomIn className="ai-chat-diagram-zoom-icon" aria-hidden="true" />
          <span>Click to inspect microservices</span>
        </div>
      </button>

      {diagram.caption && (
        <p className="ai-chat-diagram-caption">{diagram.caption}</p>
      )}
    </div>
  );
};

/**
 * Renders structured assistant messages with titles, summaries, and bulleted sections.
 * Falls back to SafeFormattedText if structure is incomplete or invalid.
 */
const StructuredAssistantMessage = ({ structured, fallbackContent, onOpenDiagram }) => {
  if (!structured || typeof structured !== "object") {
    return <SafeFormattedText content={fallbackContent} />;
  }

  const { title, summary, sections, diagram } = structured;
  const hasSections = Array.isArray(sections) && sections.length > 0;
  const isInlineDiagram = diagram?.displayMode === "inline";
  const isOptionalDiagram = diagram && !isInlineDiagram;

  // If there's no title and no sections, render summary or fallback
  if (!title && !hasSections) {
    return (
      <div className="ai-chat-structured-content">
        <SafeFormattedText content={summary || fallbackContent} />
        {diagram && (
          <ArchitectureDiagramCard
            diagram={diagram}
            onOpenDiagram={onOpenDiagram}
          />
        )}
      </div>
    );
  }

  return (
    <div className="ai-chat-structured-content">
      {title && <h4 className="ai-chat-structured-title">{title}</h4>}
      {summary && <p className="ai-chat-structured-summary">{summary}</p>}

      {isInlineDiagram && (
        <ArchitectureDiagramCard
          diagram={diagram}
          onOpenDiagram={onOpenDiagram}
        />
      )}

      {hasSections && (
        <div className="ai-chat-sections-wrap">
          {sections.map((section, sIdx) => (
            <div key={`sec-${sIdx}`} className="ai-chat-section-block">
              {section.heading && (
                <div className="ai-chat-section-heading">{section.heading}</div>
              )}
              {Array.isArray(section.items) && section.items.length > 0 && (
                <ul className="ai-chat-section-list">
                  {section.items.map((item, iIdx) => (
                    <li key={`item-${iIdx}`}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {isOptionalDiagram && (
        <ArchitectureDiagramCard
          diagram={diagram}
          onOpenDiagram={onOpenDiagram}
        />
      )}
    </div>
  );
};

/**
 * Returns an appropriate icon based on the link type.
 */
const getLinkIcon = (type) => {
  switch (type) {
    case "github":
      return <FiGithub className="ai-chat-link-icon" />;
    case "linkedin":
      return <FiLinkedin className="ai-chat-link-icon" />;
    case "certificate":
      return <FiAward className="ai-chat-link-icon" />;
    case "email":
      return <FiMail className="ai-chat-link-icon" />;
    case "resume":
      return <FiFileText className="ai-chat-link-icon" />;
    default:
      return <FiExternalLink className="ai-chat-link-icon" />;
  }
};

const AIChatBot = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  // Lightbox Modal state & zoom
  const [lightboxData, setLightboxData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const lightboxCloseBtnRef = useRef(null);
  const triggerElementRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const panelRef = useRef(null);

  const handleOpenLightbox = (diagram, e) => {
    if (e && e.currentTarget) {
      triggerElementRef.current = e.currentTarget;
    } else if (document.activeElement) {
      triggerElementRef.current = document.activeElement;
    }
    setLightboxData(diagram);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxData(null);
    setZoom(1);
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => setZoom(1);

  // Focus close button when lightbox opens
  useEffect(() => {
    if (lightboxData) {
      setTimeout(() => {
        lightboxCloseBtnRef.current?.focus();
      }, 50);
    }
  }, [lightboxData]);

  // Auto-scroll on new message or loading change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [messages, isLoading, isOpen, prefersReducedMotion]);

  // Focus input when opening on desktop
  useEffect(() => {
    if (isOpen && window.innerWidth > 640) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Handle escape key and keyboard controls for modal/chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxData) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          closeLightbox();
          return;
        }
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          handleZoomIn();
          return;
        }
        if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          handleZoomOut();
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          handleResetZoom();
          return;
        }
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, lightboxData]);

  const handleSend = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    setInput("");
    setLastFailedMessage(null);

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Build history excluding welcome and system messages
      const historyPayload = newMessages
        .filter((m) => m.id !== "welcome-msg")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: queryText,
          history: historyPayload,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      let data = null;

      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!data) {
        const textError = await res.text().catch(() => "");
        throw new Error(textError || `Server returned error status ${res.status}`);
      }

      if (!res.ok && !data.reply) {
        throw new Error(data.error || "Failed to reach AI service.");
      }

      // Filter and validate links against portfolio data
      const validatedLinks = (data.suggestedLinks || []).filter((l) =>
        isTrustedUrl(l.url)
      );

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I couldn't generate a response. Please try again.",
        structured: data.structured || null,
        suggestedLinks: validatedLinks,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chatbot query error:", err);
      setLastFailedMessage(queryText);
      const isConfigError =
        err.message?.includes("GEMINI_API_KEY") ||
        err.message?.includes("API key");
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        isError: true,
        content: isConfigError
          ? "⚠️ **Gemini API key is not configured.** Please add `GEMINI_API_KEY` to your environment variables."
          : "⚠️ I'm currently unable to respond due to a network or service issue. Please try again shortly or reach out to Jit directly.",
        suggestedLinks: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setLastFailedMessage(null);
    setInput("");
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSend(lastFailedMessage);
    }
  };

  return (
    <>
      {/* 3D Floating Bot Trigger */}
      <button
        type="button"
        className={`ai-3d-floating-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close Jit's AI Assistant" : "Ask about Jit"}
        aria-expanded={isOpen}
        aria-controls="ai-portfolio-chat-panel"
        title={isOpen ? "Close Assistant" : "Ask about Jit"}
      >
        <div className="ai-3d-bot-figure-wrap">
          <Bot3D size={64} />
          {isOpen && (
            <span className="ai-3d-bot-close-badge" aria-hidden="true">
              <FiX />
            </span>
          )}
        </div>

        <span className="ai-3d-bot-label">
          {isOpen ? "Close" : "Ask about Jit"}
        </span>
      </button>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            id="ai-portfolio-chat-panel"
            ref={panelRef}
            className="ai-chat-panel"
            role="dialog"
            aria-label="Jit's AI Assistant"
            aria-modal="true"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 15, scale: 0.96 }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <header className="ai-chat-header">
              <div className="ai-chat-header-identity">
                <div className="ai-chat-avatar" aria-hidden="true">
                  <Bot3D size={32} />
                </div>
                <div className="ai-chat-title-wrap">
                  <span className="ai-chat-title">Jit's AI Assistant</span>
                  <span className="ai-chat-status">
                    <span className="ai-chat-status-dot" aria-hidden="true" />
                    Portfolio Guide • Gemini AI
                  </span>
                </div>
              </div>

              <div className="ai-chat-header-actions">
                <button
                  type="button"
                  className="ai-chat-btn-icon"
                  onClick={handleReset}
                  aria-label="Restart conversation"
                  title="Restart conversation"
                >
                  <FiRotateCcw aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="ai-chat-btn-icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat window"
                  title="Close chat window"
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Scrollable Messages Area */}
            <div className="ai-chat-messages" role="log" aria-live="polite">
              {/* Welcome box with starter chips */}
              <div className="ai-chat-welcome-card">
                <p className="ai-chat-welcome-text">
                  Welcome! Ask questions or tap a starter query below:
                </p>
                <div className="ai-chat-starter-title">Suggested Inquiries</div>
                <div className="ai-chat-starter-chips">
                  {STARTER_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="ai-chat-chip-btn"
                      onClick={() => handleSend(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message History */}
              {messages.map((msg) => (
                <div key={msg.id} className={`ai-chat-msg-row ${msg.role}`}>
                  <div className="ai-chat-bubble">
                    {msg.role === "assistant" && msg.structured ? (
                      <StructuredAssistantMessage
                        structured={msg.structured}
                        fallbackContent={msg.content}
                        onOpenDiagram={handleOpenLightbox}
                      />
                    ) : (
                      <SafeFormattedText content={msg.content} />
                    )}

                    {msg.isError && lastFailedMessage && (
                      <div className="ai-chat-error-box">
                        <button
                          type="button"
                          className="ai-chat-retry-btn"
                          onClick={handleRetry}
                        >
                          Retry last question
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Render Verified Trusted Links */}
                  {msg.suggestedLinks && msg.suggestedLinks.length > 0 && (
                    <div className="ai-chat-suggested-links">
                      {msg.suggestedLinks.map((link) => (
                        <a
                          key={`${link.url}-${link.label}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ai-chat-link-pill"
                          title={`Open ${link.label}`}
                        >
                          <span className="ai-chat-link-left">
                            {getLinkIcon(link.type)}
                            <span className="ai-chat-link-label">{link.label}</span>
                          </span>
                          <FiExternalLink className="ai-chat-link-ext" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="ai-chat-msg-row assistant">
                  <div className="ai-chat-bubble">
                    <div className="ai-chat-loading-dots" aria-label="AI is thinking...">
                      <span className="ai-chat-loading-dot" />
                      <span className="ai-chat-loading-dot" />
                      <span className="ai-chat-loading-dot" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input & Footer */}
            <footer className="ai-chat-footer">
              <form
                className="ai-chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <textarea
                  ref={textareaRef}
                  className="ai-chat-textarea"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Jit's projects, tech stack..."
                  rows={1}
                  disabled={isLoading}
                  maxLength={1000}
                  aria-label="Your question for Jit's AI assistant"
                />

                <button
                  type="submit"
                  className="ai-chat-send-btn"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  title="Send message"
                >
                  <FiSend aria-hidden="true" />
                </button>
              </form>

              <div className="ai-chat-hint">
                <span>Enter ↵ to send • Shift+Enter for newline</span>
                <span>{input.length > 800 ? `${input.length}/1000` : ""}</span>
              </div>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Accessible Architecture Lightbox Modal */}
      <AnimatePresence>
        {lightboxData && (
          <motion.div
            className="ai-chat-lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxData.title || "AI Fitness Recommendation Engine Architecture Diagram"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
          >
            <div className="ai-chat-lightbox-card">
              {/* Lightbox Header */}
              <div className="ai-chat-lightbox-header">
                <div className="ai-chat-lightbox-title-box">
                  <div className="ai-chat-lightbox-tag">
                    <FiLayers aria-hidden="true" />
                    <span>Microservices Topology</span>
                  </div>
                  <h3 className="ai-chat-lightbox-title">
                    {lightboxData.title || "AI Fitness Recommendation Engine"}
                  </h3>
                </div>

                <div className="ai-chat-lightbox-controls">
                  <button
                    type="button"
                    className="ai-chat-lightbox-btn"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.6}
                    aria-label="Zoom out diagram"
                    title="Zoom out (-)"
                  >
                    <FiZoomOut aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className="ai-chat-lightbox-btn ai-chat-lightbox-zoom-val"
                    onClick={handleResetZoom}
                    aria-label="Reset zoom to 100%"
                    title="Reset zoom (0)"
                  >
                    {Math.round(zoom * 100)}%
                  </button>

                  <button
                    type="button"
                    className="ai-chat-lightbox-btn"
                    onClick={handleZoomIn}
                    disabled={zoom >= 2.5}
                    aria-label="Zoom in diagram"
                    title="Zoom in (+)"
                  >
                    <FiZoomIn aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className="ai-chat-lightbox-btn"
                    onClick={handleResetZoom}
                    aria-label="Reset view zoom"
                    title="Reset view"
                  >
                    <FiRotateCcw aria-hidden="true" />
                  </button>

                  <button
                    ref={lightboxCloseBtnRef}
                    type="button"
                    className="ai-chat-lightbox-btn ai-chat-lightbox-close"
                    onClick={closeLightbox}
                    aria-label="Close architecture diagram"
                    title="Close (Esc)"
                  >
                    <FiX aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Lightbox Body with Pannable / Scrollable Viewport */}
              <div
                className="ai-chat-lightbox-body"
                tabIndex={0}
                aria-label="Diagram scrollable viewer"
              >
                <div
                  className="ai-chat-lightbox-viewport"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    transition: prefersReducedMotion
                      ? "none"
                      : "transform 0.18s ease-out",
                  }}
                >
                  <img
                    src={lightboxData.src}
                    alt={
                      lightboxData.alt ||
                      "Microservices Architecture Diagram for AI Fitness Recommendation Engine"
                    }
                    className="ai-chat-lightbox-img"
                  />
                </div>
              </div>

              {/* Lightbox Footer */}
              <div className="ai-chat-lightbox-footer">
                <span className="ai-chat-lightbox-hint">
                  Scroll to pan • Use + / - to zoom • Press Esc to close
                </span>
                <a
                  href="https://github.com/jitmondal-it/fitness-ai-recommendation-microservices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ai-chat-lightbox-repo-link"
                >
                  <FiGithub aria-hidden="true" />
                  <span>Microservices Repo</span>
                  <FiExternalLink aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
