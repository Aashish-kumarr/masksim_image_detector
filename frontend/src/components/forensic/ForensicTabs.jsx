import { useState } from "react";
import ScientificVisualizationViewer from "./ScientificVisualizationViewer";
import ScoreScale from "../common/ScoreScale";
import { formatBytes } from "../../utils/formatBytes";
import { Layers, Cpu, ShieldCheck, Database, Check, Clock, FileText } from "lucide-react";

export default function ForensicTabs({ result = {}, file = null, previewUrl = "" }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "DnCNN Residual",
    "Spectrum",
    "Learned Mask",
    "Learned Reference",
    "Technical Details",
  ];

  const explainability = result.explainability || {};
  const isAvailable = Boolean(explainability.available);
  const input = result.input || {};
  const analysis = result.analysis || {};
  const detector = result.detector || {};

  return (
    <div className="card" style={{ marginTop: "32px" }}>
      {/* Tab Navigation */}
      <div
        className="tab-nav"
        role="tablist"
        aria-label="Forensic Inspection Tabs"
        style={{ marginBottom: "24px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
              Forensic Overview & Decision Rationale
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Summary of analytical signals extracted across spatial and frequency domains.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            <div className="card-subtle">
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
                Signal Classification
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, marginTop: "6px", color: result.prediction === "AI_GENERATED" ? "var(--color-synthetic)" : "var(--color-real)" }}>
                {result.prediction === "AI_GENERATED" ? "Synthetic Match Detected" : "Authentic Pattern (No Signal)"}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                {result.prediction === "AI_GENERATED"
                  ? "Residual frequency distribution exhibits strong harmonic alignment with Stable Diffusion 1.4 autoencoder lattice fingerprints."
                  : "Residual frequency distribution is consistent with natural uncompressed camera sensor noise patterns."}
              </p>
            </div>

            <div className="card-subtle">
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
                Cosine Alignment
              </div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: 700, marginTop: "6px", color: "var(--text-primary)" }}>
                {analysis.cosineSimilarity != null ? analysis.cosineSimilarity.toFixed(4) : "—"}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Projection between the masked residual spectrum and learned synthetic reference spectrum.
              </p>
            </div>

            <div className="card-subtle">
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
                Center Crop Verification
              </div>
              <div className="mono" style={{ fontSize: "20px", fontWeight: 700, marginTop: "6px", color: "var(--text-primary)" }}>
                512 × 512 px
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Deterministic center crop extracted after EXIF orientation normalisation to avoid spatial resizing distortions.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
              Decision Scale
            </h4>
            <ScoreScale score={result.score || 0} threshold={result.threshold || 0.5} />
          </div>
        </div>
      )}

      {/* Tab 2: DnCNN Residual */}
      {activeTab === "DnCNN Residual" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
              DnCNN Noise Residual Extraction
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              The DnCNN stage suppresses visible low-frequency scene content and exposes underlying residual patterns used for frequency analysis.
            </p>
          </div>

          <ScientificVisualizationViewer
            title="Residual Image / Spatial Noise Structure"
            subtitle="Figure 2.1: Spatial residual R = X - DnCNN(X) exposing sensor patterns and generative artifacts."
            available={isAvailable}
            images={{ combined: explainability.residualImage }}
            note={explainability.note}
            source="DnCNN 20-layer residual filter"
            transform="Identity Residual Subtraction"
            representation="Residual Tensor (Float32)"
            resolution="512 × 512 px"
            sidebarTitle="Residual Parameters"
          />
        </div>
      )}

      {/* Tab 3: Spectrum */}
      {activeTab === "Spectrum" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
              Frequency Spectrum (2D FFT)
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              2D Fast Fourier Transform applied to the YCbCr residual channels with orthogonal normalization and centered zero-frequency DC.
            </p>
          </div>

          <ScientificVisualizationViewer
            title="Frequency Spectrum (Log-Magnitude)"
            subtitle="Figure 2.2: Shifted 2D Fourier spectrum log(1 + |F(u,v)|) across selectable color channels."
            available={isAvailable}
            images={{
              combined: explainability.spectrumCombined,
              y: explainability.spectrumY,
              cb: explainability.spectrumCb,
              cr: explainability.spectrumCr,
            }}
            note={explainability.note}
            source="DnCNN residual"
            transform="2D-RFFT Centered Shifted"
            representation="log(1 + |F(u, v)|)"
            resolution="512 × 512 px"
            sidebarTitle="Spectrum Parameters"
          />
        </div>
      )}

      {/* Tab 4: Learned Mask */}
      {activeTab === "Learned Mask" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
              Learned Frequency Mask
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              The learned mask emphasizes frequency locations the detector discovered to be most discriminative during training on Stable Diffusion 1.4 samples.
            </p>
          </div>

          <ScientificVisualizationViewer
            title="Learned Frequency Mask M"
            subtitle="Figure 2.3: Spatial weight distribution in frequency domain optimized to highlight generator artifacts."
            available={isAvailable}
            images={{
              combined: explainability.maskCombined,
            }}
            note={explainability.note}
            source="MaskSim 1x1 Conv + Sigmoid Weights"
            transform="Elementwise Multiplicative Mask"
            representation="Weight Values [0, 1]"
            resolution="512 × 512 px"
            sidebarTitle="Mask Parameters"
          />
        </div>
      )}

      {/* Tab 5: Learned Reference */}
      {activeTab === "Learned Reference" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
              Learned Synthetic Reference
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              The analyzed spectrum is compared against this learned canonical reference using cosine similarity.
            </p>
          </div>

          <ScientificVisualizationViewer
            title="Learned Canonical Reference Spectrum"
            subtitle="Figure 2.4: Synthetic fingerprint archetype optimized across the training distribution."
            available={isAvailable}
            images={{
              combined: explainability.referenceSpectrum,
            }}
            note={explainability.note}
            source="MaskSim Learned Canonical Vector"
            transform="Normalized Cosine Similarity Vector"
            representation="Canonical Frequency Profile"
            resolution="512 × 512 px"
            sidebarTitle="Reference Parameters"
          />
        </div>
      )}

      {/* Tab 6: Technical Details */}
      {activeTab === "Technical Details" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
              Specification & Forensic Traceability Matrix
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Deterministic parameter readout for this analysis invocation.
            </p>
          </div>

          <div className="definition-matrix">
            {/* Column A */}
            <div className="matrix-column">
              <div className="matrix-row">
                <span className="matrix-label">Original filename</span>
                <span className="matrix-value">{file?.name || "Uploaded Image"}</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Original dimensions</span>
                <span className="matrix-value">
                  {input.originalWidth && input.originalHeight
                    ? `${input.originalWidth} × ${input.originalHeight} px`
                    : "—"}
                </span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Analyzed dimensions</span>
                <span className="matrix-value">
                  {input.analyzedWidth && input.analyzedHeight
                    ? `${input.analyzedWidth} × ${input.analyzedHeight} px (Center)`
                    : "512 × 512 px (Deterministic Center)"}
                </span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">File format / MIME</span>
                <span className="matrix-value">{input.mimeType || file?.type || "image/png"}</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">File payload size</span>
                <span className="matrix-value">
                  {input.sizeBytes ? formatBytes(input.sizeBytes) : file?.size ? formatBytes(file.size) : "—"}
                </span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Preprocessing pipeline</span>
                <span className="matrix-value">RGB → YCbCr conversion</span>
              </div>
            </div>

            {/* Column B */}
            <div className="matrix-column">
              <div className="matrix-row">
                <span className="matrix-label">Residual stage</span>
                <span className="matrix-value">DnCNN (20 layers, 668,227 params)</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Forensic detector</span>
                <span className="matrix-value">{detector.name || "MaskSim SD1.4"}</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Model version</span>
                <span className="matrix-value">{detector.version || "masksim-sd14-v1"}</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Cosine similarity</span>
                <span className="matrix-value">
                  {analysis.cosineSimilarity != null ? analysis.cosineSimilarity.toFixed(4) : "—"}
                </span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Decision threshold</span>
                <span className="matrix-value">{Number(result.threshold || 0.5).toFixed(4)}</span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Detector score</span>
                <span
                  className="matrix-value"
                  style={{
                    color: result.prediction === "AI_GENERATED" ? "var(--color-synthetic)" : "var(--color-real)",
                    fontWeight: 700,
                  }}
                >
                  {Number(result.score || 0).toFixed(4)}
                </span>
              </div>
              <div className="matrix-row">
                <span className="matrix-label">Inference latency</span>
                <span className="matrix-value">
                  {analysis.inferenceMs != null ? `${analysis.inferenceMs} ms` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
