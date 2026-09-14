import { useState } from "react";
import { formatBytes } from "../../utils/formatBytes";
import {
  Play,
  RotateCcw,
  Trash2,
  Crop,
  FileCheck,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function ImagePreview({
  file,
  previewUrl,
  dimensions = null,
  loading = false,
  onAnalyze,
  onReplace,
  onRemove,
}) {
  const [viewMode, setViewMode] = useState("crop"); // 'crop' | 'original'

  if (!file) return null;

  return (
    <div className="card" style={{ marginTop: "16px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Image Viewport (~65%) */}
        <div style={{ flex: "1.8", display: "flex", flexDirection: "column" }}>
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
                className={`tab-btn ${viewMode === "crop" ? "active" : ""}`}
                onClick={() => setViewMode("crop")}
              >
                Model Input (512×512 Center)
              </button>
              <button
                type="button"
                className={`tab-btn ${viewMode === "original" ? "active" : ""}`}
                onClick={() => setViewMode("original")}
              >
                Original Source
              </button>
            </div>

            <div
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
              <span>Deterministic Center Crop</span>
            </div>
          </div>

          {/* Viewport Frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: viewMode === "crop" ? "1 / 1" : "auto",
              maxHeight: "520px",
              background: "#090d16",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={previewUrl}
              alt="Selected input specimen"
              style={{
                width: "100%",
                height: "100%",
                objectFit: viewMode === "crop" ? "cover" : "contain",
                transition: "transform 0.2s ease",
              }}
            />

            {/* Scientific Targeting Overlay for Crop Mode */}
            {viewMode === "crop" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "16px", height: "16px", borderTop: "2px solid var(--accent-blue)", borderLeft: "2px solid var(--accent-blue)" }} />
                  <div style={{ width: "16px", height: "16px", borderTop: "2px solid var(--accent-blue)", borderRight: "2px solid var(--accent-blue)" }} />
                </div>
                {/* Center crosshair */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.35 }}>
                  <div style={{ width: "32px", height: "1px", background: "var(--accent-blue)" }} />
                  <div style={{ height: "32px", width: "1px", background: "var(--accent-blue)", margin: "-16px auto 0" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "16px", height: "16px", borderBottom: "2px solid var(--accent-blue)", borderLeft: "2px solid var(--accent-blue)" }} />
                  <div style={{ width: "16px", height: "16px", borderBottom: "2px solid var(--accent-blue)", borderRight: "2px solid var(--accent-blue)" }} />
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
            <span className="mono">{file.name}</span>
            <span>{viewMode === "crop" ? "Evaluated 512×512 Window" : "Full Source Dimension"}</span>
          </div>
        </div>

        {/* Right Column: Metadata & Actions (~35%) */}
        <div style={{ flex: "1.2", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--accent-blue)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "4px",
              }}
            >
              <FileCheck size={14} />
              <span>Specimen Ready</span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
              {loading ? "Analyzing image…" : "Ready to analyze"}
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: 1.5 }}>
              {loading
                ? "Residual and frequency-domain characteristics are being evaluated by the MaskSim detector pipeline."
                : "Image verified for resolution and format constraints. Deterministic 512×512 center crop will be passed to DnCNN residual extractor."}
            </p>
          </div>

          {/* Loading Progress State */}
          {loading ? (
            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--accent-blue)", fontWeight: 600, fontSize: "14px" }}>
                <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                <span>Forensic Pipeline In Progress</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)" }} />
                  <span>Preparing 512×512 center crop</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)" }} />
                  <span>Extracting residual structure via DnCNN</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)" }} />
                  <span>Computing 2D-RFFT shifted spectrum</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)" }} />
                  <span>Evaluating learned SD1.4 frequency mask</span>
                </div>
              </div>

              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            /* File Metadata Summary List */
            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Filename</span>
                <span className="mono" style={{ fontWeight: 600, color: "var(--text-primary)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {file.name}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>File Format</span>
                <span className="mono" style={{ color: "var(--text-primary)" }}>{file.type || "image/png"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>File Payload Size</span>
                <span className="mono" style={{ color: "var(--text-primary)" }}>{formatBytes(file.size)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>Model Window</span>
                <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>512 × 512 px</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
            <button
              type="button"
              className="btn-primary"
              disabled={loading}
              onClick={onAnalyze}
              style={{ width: "100%", padding: "10px 16px" }}
            >
              <Play size={16} />
              <span>{loading ? "Analyzing Specimen…" : "Analyze Image"}</span>
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-secondary"
                disabled={loading}
                onClick={onReplace}
                style={{ flex: 1 }}
              >
                <RotateCcw size={14} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                disabled={loading}
                onClick={onRemove}
                style={{ flex: 1, color: "var(--color-synthetic)" }}
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
