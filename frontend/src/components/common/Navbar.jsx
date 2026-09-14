import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Github, Menu, X, Shield, PlusCircle } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/analyze", label: "Analyze" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/model", label: "Model" },
    { to: "/dataset", label: "Dataset" },
    { to: "/performance", label: "Performance" },
    { to: "/history", label: "History" },
    { to: "/limitations", label: "Limitations" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-group">
          <Link to="/" className="navbar-brand" aria-label="MaskSim Home">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "var(--accent-blue)" }}
            >
              <rect width="32" height="32" rx="6" fill="currentColor" fillOpacity="0.1" />
              <path
                d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="2 4"
              />
              <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
            <span>MaskSim</span>
          </Link>
          <span className="navbar-badge">v1.0-SD1.4</span>
        </div>

        <nav className="navbar-nav" aria-label="Main Navigation">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <a
            href="https://github.com/Aashish-kumarr/masksim_image_detector"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <Github size={18} />
          </a>

          <Link to="/analyze" className="btn-primary">
            <PlusCircle size={16} />
            <span>Analyze Image</span>
          </Link>

          <button
            type="button"
            className="btn-ghost mobile-menu-btn"
            style={{ display: "none" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 100,
          }}
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: "8px 0",
                fontSize: "15px",
                fontWeight: isActive ? "600" : "500",
                color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
