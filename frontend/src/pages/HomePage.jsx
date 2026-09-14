import { Link } from "react-router-dom";
import { ArrowRight, Activity, Shield, Cpu, Layers, CheckCircle2, ChevronRight, UploadCloud } from "lucide-react";

export default function HomePage() {
  const pipelineSteps = [
    { num: "01", name: "Input Image", desc: "Original specimen" },
    { num: "02", name: "Residual", desc: "DnCNN noise filtering" },
    { num: "03", name: "Frequency Spectrum", desc: "2D-RFFT centered shift" },
    { num: "04", name: "Learned Mask", desc: "Frequency weighting" },
    { num: "05", name: "Detector Score", desc: "Cosine similarity projection" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
      {/* Hero Section */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "48px",
          alignItems: "center",
          padding: "24px 0 12px",
        }}
      >
        {/* Left Hero Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              background: "var(--accent-subtle)",
              border: "1px solid var(--accent-border)",
              borderRadius: "var(--radius-full)",
              color: "var(--accent-blue)",
              fontSize: "12px",
              fontWeight: 600,
              width: "fit-content",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Shield size={14} />
            <span>AI image forensics</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 750,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Detect synthetic image fingerprints.
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              maxWidth: "520px",
            }}
          >
            MaskSim analyzes residual and frequency-domain patterns in uploaded images to identify signals associated with AI-generated content.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "8px" }}>
            <Link to="/analyze" className="btn-primary" style={{ padding: "12px 24px", fontSize: "14.5px" }}>
              <span>Analyze an image</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/how-it-works" className="btn-secondary" style={{ padding: "12px 20px", fontSize: "14.5px" }}>
              <span>How it works</span>
            </Link>
          </div>
        </div>

        {/* Right Hero Product Preview Card */}
        <div
          className="card"
          style={{
            padding: "24px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-blue)" }} />
              <span className="mono" style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                FORENSIC RETICLE
              </span>
            </div>
            <span className="navbar-badge">512 × 512 WINDOW</span>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 10",
              background: "#090d16",
              borderRadius: "var(--radius-md)",
              border: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              overflow: "hidden",
            }}
          >
            {/* Grid background */}
            <div className="sci-grid-lines">
              <div /><div /><div /><div />
              <div /><div /><div /><div />
              <div /><div /><div /><div />
              <div /><div /><div /><div />
            </div>

            <div style={{ textAlign: "center", zIndex: 1, padding: "20px" }}>
              <Activity size={32} style={{ color: "#38bdf8", margin: "0 auto 8px" }} />
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>
                Spectral Domain Analysis
              </div>
              <p style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px" }}>
                2D-RFFT Centered Log Magnitude Spectrum
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "var(--text-secondary)",
              paddingTop: "4px",
            }}
          >
            <span>Target Architecture: <strong>Stable Diffusion 1.4</strong></span>
            <Link to="/analyze" style={{ color: "var(--accent-blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Upload image</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Forensic Pipeline Steps */}
      <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="page-eyebrow">End-to-End Pipeline</div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
              How MaskSim extracts synthetic signals
            </h2>
          </div>
          <Link to="/how-it-works" style={{ fontSize: "13px", color: "var(--accent-blue)", fontWeight: 600 }}>
            View step-by-step breakdown →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {pipelineSteps.map((step) => (
            <div key={step.num} className="card-subtle" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="mono" style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-blue)" }}>
                {step.num}
              </div>
              <div style={{ fontSize: "14.5px", fontWeight: 650, color: "var(--text-primary)" }}>
                {step.name}
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Detector Specifications & Performance Preview */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Left: Detector Specifications */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div className="page-eyebrow">Model Specification</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
              Current Detector: MaskSim SD1.4
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Generator Focus</span>
              <strong style={{ color: "var(--text-primary)" }}>Stable Diffusion 1.4</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Model Input Window</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--text-primary)" }}>512 × 512 px (Deterministic Center)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Color Space</span>
              <span className="mono" style={{ color: "var(--text-primary)" }}>YCbCr</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Decision Threshold</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--text-primary)" }}>0.5000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Total Parameters</span>
              <span className="mono" style={{ color: "var(--text-primary)" }}>2,241,111</span>
            </div>
          </div>

          <Link to="/model" className="btn-secondary" style={{ marginTop: "auto", alignSelf: "flex-start" }}>
            <span>View model card</span>
          </Link>
        </div>

        {/* Right: Performance Preview */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div className="page-eyebrow">Evaluation Benchmark</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
              Held-Out Evaluation Metrics
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
              Evaluated strictly on held-out test split (RAISE-1k authentic vs Synthbuster SD1.4).
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            <div className="card-subtle" style={{ textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                AUC
              </div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: 750, color: "var(--accent-blue)", marginTop: "4px" }}>
                98.25%
              </div>
            </div>

            <div className="card-subtle" style={{ textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Accuracy
              </div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: 750, color: "var(--accent-blue)", marginTop: "4px" }}>
                91.89%
              </div>
            </div>

            <div className="card-subtle" style={{ textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                F1 Score
              </div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: 750, color: "var(--accent-blue)", marginTop: "4px" }}>
                92.05%
              </div>
            </div>
          </div>

          <div className="notice-box notice-info" style={{ marginTop: "auto", fontSize: "12px" }}>
            <span>
              <strong>Note:</strong> Performance metrics reflect evaluation on Stable Diffusion 1.4 synthetic content against authentic camera images. Performance may degrade on unseen generative architectures.
            </span>
          </div>

          <Link to="/performance" className="btn-secondary" style={{ alignSelf: "flex-start" }}>
            <span>Full performance & confusion matrix</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
