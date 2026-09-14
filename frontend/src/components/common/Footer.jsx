import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-links">
            <Link to="/analyze" className="footer-link">
              Analyze
            </Link>
            <Link to="/how-it-works" className="footer-link">
              How It Works
            </Link>
            <Link to="/model" className="footer-link">
              Model
            </Link>
            <Link to="/dataset" className="footer-link">
              Dataset Splits
            </Link>
            <Link to="/performance" className="footer-link">
              Performance
            </Link>
            <Link to="/limitations" className="footer-link">
              Limitations
            </Link>
            <Link to="/about" className="footer-link">
              About
            </Link>
            <a
              href="https://github.com/Aashish-kumarr/masksim_image_detector"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
          </div>

          <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} MaskSim Forensics
          </div>
        </div>

        <div className="footer-disclaimer">
          <strong>Forensic Notice:</strong> MaskSim is a research detector optimized for Stable Diffusion 1.4 fingerprints. Results provide forensic analytical evidence rather than absolute proof of image origin. Performance may vary significantly on unseen generator architectures and compressed media.
        </div>
      </div>
    </footer>
  );
}
