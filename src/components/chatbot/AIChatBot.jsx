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
 * Renders structured assistant messages with titles, summaries, and bulleted sections.
 * Falls back to SafeFormattedText if structure is incomplete or invalid.
 */
const StructuredAssistantMessage = ({ structured, fallbackContent }) => {
  if (!structured || typeof structured !== "object") {
    return <SafeFormattedText content={fallbackContent} />;
  }

  const { title, summary, sections } = structured;
  const hasSections = Array.isArray(sections) && sections.length > 0;

  // If there's no title and no sections, render summary or fallback
  if (!title && !hasSections) {
    return <SafeFormattedText content={summary || fallbackContent} />;
  }

  return (
    <div className="ai-chat-structured-content">
      {title && <h4 className="ai-chat-structured-title">{title}</h4>}
      {summary && <p className="ai-chat-structured-summary">{summary}</p>}

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

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const panelRef = useRef(null);

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

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

      const data = await res.json();

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
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        isError: true,
        content:
          "⚠️ I'm currently unable to respond due to a network or service issue. Please try again or reach out to Jit directly.",
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
    </>
  );
};

export default AIChatBot;
