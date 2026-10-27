import { useState } from "react";
import { FiCheck, FiCopy, FiMail, FiSend } from "react-icons/fi";
import { profile } from "../../data/profile";
import SocialLinks from "../common/SocialLinks";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="section-wrap">
      <div className="section-header">
        <h2 className="section-title">
          <FiMail className="section-title-icon" aria-hidden="true" />
          <span>Get In Touch</span>
        </h2>
        <span className="section-subtext">Let's discuss opportunities & collaborations</span>
      </div>

      <div className="glass-card contact-card">
        <div className="contact-inner">
          <h3 className="contact-headline">Interested in collaborating or hiring?</h3>
          <p className="contact-body">
            I'm always open to discussing backend architectures, full-stack engineering roles, or innovative projects. Feel free to reach out directly via email or connect on social platforms.
          </p>

          <div className="contact-actions-row">
            <a href={`mailto:${profile.email}`} className="btn-clean-link primary">
              <FiSend className="icon-mr" />
              <span>Say Hello</span>
            </a>

            <button
              type="button"
              className="btn-clean-link"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? (
                <>
                  <FiCheck className="icon-mr text-success" />
                  <span>Email Copied!</span>
                </>
              ) : (
                <>
                  <FiCopy className="icon-mr" />
                  <span>{profile.email}</span>
                </>
              )}
            </button>
          </div>

          <div className="contact-social-row">
            <span className="social-tag">Find me on:</span>
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
