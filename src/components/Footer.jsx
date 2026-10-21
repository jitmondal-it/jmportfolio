import { FiArrowUp } from "react-icons/fi";
import { profile } from "../content/site";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-text">
          © {year} {profile.name} • Designed & Built with care.
        </p>

        <button
          type="button"
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <span>Back to top</span>
          <FiArrowUp className="icon-ml" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
