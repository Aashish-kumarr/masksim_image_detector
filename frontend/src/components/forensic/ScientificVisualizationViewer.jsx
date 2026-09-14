import { useState } from "react";
import { Activity, Layers, Info, CheckCircle2 } from "lucide-react";

export default function ScientificVisualizationViewer({
  title = "2D FFT Shifted Log-Magnitude Spectrum",
  subtitle = "Figure 1.2: Normalized 2D Fast Fourier Transform shifted spectrum extracted from the DnCNN residual.",
  images = {},
  available = false,
  note = "",
  source = "DnCNN residual",
  transform = "2D-RFFT Centered Shifted",
  representation = "log(1 + |F(u, v)|)",
  resolution = "512 × 512 px",
  activeChannelDefault = "Combined",
  showSidebar = true,
  sidebarTitle = "Spectral Parameters",
}) {
  const [activeChannel, setActiveChannel] = useState(activeChannelDefault);

  const channelMap = {
    Combined: images.combined || images.spectrumCombined || images.cropImage || images.residualImage || images.maskCombined || images.referenceSpectrum,
    Y: images.y || images.spectrumY,
    Cb: images.cb || images.spectrumCb,
    Cr: images.cr || images.spectrumCr,
  };

  const activeImage = channelMap[activeChannel];

  return (
    <div className="sci-viewer">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>{title}</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Representation extracted and analyzed by MaskSim
          </p>
        </div>

        {/* Channel selection tabs */}
        <div className="tab-nav" role="tablist" aria-label="Frequency channels">
          {["Combined", "Y", "Cb", "Cr"].map((ch) => (
            <button
              key={ch}
              role="tab"
              aria-selected={activeChannel === ch}
              className={`tab-btn ${activeChannel === ch ? "active" : ""}`}
              onClick={() => setActiveChannel(ch)}
            >
              {ch} {ch !== "Combined" ? `(${ch === "Y" ? "Luma" : ch === "Cb" ? "Chroma-B" : "Chroma-R"})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: showSidebar ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr",
          gap: "24px",
          alignItems: "stretch",
        }}
      >
        {/* Left: Scientific Plot Frame */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="sci-viewport-box" style={{ width: "100%" }}>
            {/* Axis U (Vertical) */}
            <div className="sci-axis-u">
              <span>+256</span>
              <span>← Freq u →</span>
              <span>-256</span>
            </div>

            {/* Inner Viewport */}
            <div className="sci-viewport-inner">
              {/* Subtle Grid Guidelines */}
              <div className="sci-grid-lines">
                <div /><div /><div /><div />
                <div /><div /><div /><div />
                <div /><div /><div /><div />
                <div /><div /><div /><div />
              </div>

              {/* Central DC marker */}
              <div className="sci-dc-marker" title="Center DC (0,0)" />

              {/* Render Image or Development Empty State */}
              {available && activeImage ? (
                <img
                  src={activeImage}
                  alt={`${title} - ${activeChannel} Channel`}
                  style={{ width: "100%", height: "100%", objectFit: "contain", position: "relative", zIndex: 1 }}
                />
              ) : (
                <div className="sci-placeholder-state">
                  <Activity size={28} style={{ color: "#38bdf8", opacity: 0.8 }} />
                  <div className="sci-placeholder-title">
                    Frequency Visualization
                  </div>
                  <p className="sci-placeholder-desc">
                    Frequency visualization will appear here when explainability output is available.
                  </p>
                  {note && (
                    <div
                      className="mono"
                      style={{
                        marginTop: "10px",
                        fontSize: "11px",
                        background: "rgba(15, 23, 42, 0.8)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #334155",
                        color: "#94a3b8",
                      }}
                    >
                      {note}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Axis V (Horizontal) */}
            <div className="sci-axis-v">
              <span>-256</span>
              <span style={{ color: "#94a3b8", fontWeight: 500 }}>Frequency v (Horizontal)</span>
              <span>+256</span>
            </div>
          </div>

          <div
            className="mono"
            style={{
              fontSize: "11.5px",
              color: "var(--text-muted)",
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Right: Technical Parameters Sidebar */}
        {showSidebar && (
          <div
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 650,
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <Layers size={16} style={{ color: "var(--accent-blue)" }} />
                <span>{sidebarTitle}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Active Channel</span>
                  <span className="mono" style={{ fontWeight: 600, color: "var(--accent-blue)" }}>
                    {activeChannel}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Representation</span>
                  <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {representation}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Transform</span>
                  <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {transform}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Shift</span>
                  <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    Centered (fftshift)
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Source Stage</span>
                  <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {source}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Resolution</span>
                  <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {resolution}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                fontSize: "12px",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "4px" }}>
                <Info size={14} style={{ color: "var(--accent-blue)" }} />
                <span>Deterministic Forward Pass</span>
              </div>
              Evaluated on 512×512 center crop with orthographic FFT normalization. High-frequency coordinates highlight periodic artifacts characteristic of latent diffusion upsampling.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
