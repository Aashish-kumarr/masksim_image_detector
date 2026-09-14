import { useState } from "react";
import { Link } from "react-router-dom";
import ScoreScale from "../common/ScoreScale";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileCode,
  Info,
  PlusCircle,
  Crop,
  Layers,
} from "lucide-react";

export default function ResultSummary({ result, file, previewUrl, onReset }) {
  const [previewMode, setPreviewMode] = useState("crop");

  if (!result) return null;

  const score = Number(result.score || 0);
  const threshold = Number(result.threshold || 0.5);
  const isSynthetic = result.prediction === "AI_GENERATED" || score >= threshold;
  const analysis = result.analysis || {};
  const detector = result.detector || {};
  const input = result.input || {};

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `masksim-analysis-${result.id || "result"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrintReport() {
    window.print();
  }

  return (
    <div className="card" style={{ marginTop: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: Specimen Viewer (approx 42%) */}
        <div style={{ flex: "1.1", display: "flex", flexDirection: "column" }}>
          {/* View Toggles */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div className="tab-nav" role="tablist">
              <button
                type="button"
                className={`tab-btn ${previewMode === "crop" ? "active" : ""}`}
                onClick={() => setPreviewMode("crop")}
              >
                Model Input (512×512)
              </button>
              <button
                type="button"
                className={`tab-btn ${previewMode === "original" ? "active" : ""}`}
                onClick={() => setPreviewMode("original")}
              >
                Original Source
              </button>
            </div>

            <span
              className="mono"
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Crop size={12} />
              <span>Centered</span>
            </span>
          </div>

          {/* Viewport Frame with Reticle */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: previewMode === "crop" ? "1 / 1" : "auto",
              maxHeight: "440px",
              background: "#090d16",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Analyzed target specimen"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: previewMode === "crop" ? "cover" : "contain",
                }}
              />
            ) : (
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Layers size={28} />
                <span>Model Input Window</span>
              </div>
            )}

            {/* Targeting Reticle */}
            {previewMode === "crop" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "12px", height: "12px", borderTop: "2px solid var(--accent-blue)", borderLeft: "2px solid var(--accent-blue)" }} />
                  <div style={{ width: "12px", height: "12px", borderTop: "2px solid var(--accent-blue)", borderRight: "2px solid var(--accent-blue)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "12px", height: "12px", borderBottom: "2px solid var(--accent-blue)", borderLeft: "2px solid var(--accent-blue)" }} />
                  <div style={{ width: "12px", height: "12px", borderBottom: "2px solid var(--accent-blue)", borderRight: "2px solid var(--accent-blue)" }} />
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <span className="mono">{file?.name || "Target Specimen"}</span>
            <span>Deterministic Center Crop · Bicubic</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Detector Analytics (approx 58%) */}
        <div style={{ flex: "1.4", display: "flex", flexDirection: "column" }}>
          {/* Top Status Badge & Checkpoint */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div className={isSynthetic ? "badge-synthetic" : "badge-real"}>
              <span className="badge-dot" />
              <span>{isSynthetic ? "SYNTHETIC SIGNAL DETECTED" : "LIKELY AUTHENTIC (NO AI SIGNAL)"}</span>
            </div>

            <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Detector: <strong style={{ color: "var(--text-primary)" }}>{detector.version || "masksim-sd14-v1"}</strong>
            </span>
          </div>

          {/* Large Detector Score Readout */}
          <div style={{ marginTop: "16px", display: "flex", alignItems: "baseline", gap: "16px" }}>
            <div
              className="mono"
              style={{
                fontSize: "48px",
                lineHeight: "1",
                fontWeight: 700,
                color: isSynthetic ? "var(--color-synthetic)" : "var(--color-real)",
                letterSpacing: "-0.03em",
              }}
            >
              {score.toFixed(4)}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
                Detector Score
              </span>
              <span className="mono" style={{ fontSize: "12.5px", color: isSynthetic ? "var(--color-synthetic)" : "var(--color-real)", fontWeight: 500 }}>
                {isSynthetic ? "Synthetic SD1.4 Fingerprint Match" : "Authentic Natural Sensor Profile"}
              </span>
            </div>
          </div>

          {/* Restrained Horizontal Linear Score Scale */}
          <div style={{ marginTop: "16px" }}>
            <ScoreScale score={score} threshold={threshold} />
          </div>

          {/* Technical Specs Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "10px",
              marginTop: "20px",
              padding: "16px",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Cosine similarity</div>
              <div className="mono" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                {analysis.cosineSimilarity != null ? analysis.cosineSimilarity.toFixed(4) : "—"}
              </div>
              <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                s = cos(θ)
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Decision threshold</div>
              <div className="mono" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                {threshold.toFixed(4)}
              </div>
              <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Standard ROC
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Detector name</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                {detector.name || "MaskSim SD1.4"}
              </div>
              <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                SD1.4 Target
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Inference latency</div>
              <div className="mono" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                {analysis.inferenceMs != null ? `${analysis.inferenceMs} ms` : "—"}
              </div>
              <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Pipeline Pass
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
            {onReset ? (
              <button type="button" className="btn-primary" onClick={onReset}>
                <PlusCircle size={15} />
                <span>Analyze another image</span>
              </button>
            ) : (
              <Link to="/analyze" className="btn-primary">
                <PlusCircle size={15} />
                <span>Analyze another image</span>
              </Link>
            )}

            <button type="button" className="btn-secondary" onClick={handlePrintReport}>
              <Download size={15} />
              <span>Download forensic report (PDF)</span>
            </button>

            <button type="button" className="btn-ghost" onClick={handleExportJson}>
              <FileCode size={15} />
              <span>Export JSON metadata</span>
            </button>
          </div>

          {/* Forensic Scope Disclaimer Notice */}
          <div className="notice-box notice-info" style={{ marginTop: "20px" }}>
            <Info size={16} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ color: "var(--text-primary)" }}>Forensic Scope:</strong> The current detector is optimized for Stable Diffusion 1.4 fingerprints. Results should be treated as analytical evidence rather than absolute proof of image origin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
