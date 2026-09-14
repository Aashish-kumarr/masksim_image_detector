import { useState, useRef, useEffect, useCallback } from "react";
import FrequencyChannelTabs from "./FrequencyChannelTabs";
import FrequencyToolbar from "./FrequencyToolbar";
import FrequencyTooltip from "./FrequencyTooltip";
import { Activity, Layers, Info, X, Maximize2 } from "lucide-react";

export default function FrequencyExplorer({
  frequencyExplorer = {},
  explainability = {},
  result = {},
}) {
  // Extract images and availability from either frequencyExplorer or explainability envelope
  const explorerData = frequencyExplorer?.images ? frequencyExplorer : explainability;
  const isAvailable = Boolean(frequencyExplorer?.available || explainability?.available);
  const note = frequencyExplorer?.note || explainability?.note || "Frequency data is not available in mock mode.";
  const metadata = frequencyExplorer?.metadata || {
    width: 512,
    height: 512,
    representation: "log-magnitude",
    transform: "2D FFT",
    shift: "centered",
    source: "DnCNN residual",
  };

  const images = {
    Combined: explorerData?.images?.combined || explorerData?.spectrumCombined || explorerData?.maskedSpectrum,
    Y: explorerData?.images?.y || explorerData?.spectrumY,
    Cb: explorerData?.images?.cb || explorerData?.spectrumCb,
    Cr: explorerData?.images?.cr || explorerData?.spectrumCr,
  };

  const pointData = frequencyExplorer?.pointData || {};

  const [activeChannel, setActiveChannel] = useState("Combined");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverData, setHoverData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewportRef = useRef(null);
  const imageContainerRef = useRef(null);

  const activeImage = images[activeChannel];

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(8, Number((prev * 1.4).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Number((prev / 1.4).toFixed(2));
      if (next <= 1.05) {
        setPan({ x: 0, y: 0 });
        return 1;
      }
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Drag / Pan handlers
  function handleMouseDown(e) {
    if (zoom <= 1 || !isAvailable) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }

  function handleMouseMove(e) {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      // Clamp pan bounds
      const maxPan = 200 * (zoom - 1);
      setPan({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY)),
      });
    }

    // Compute hover coordinates relative to the 512x512 image space
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
        const normalizedX = clickX / rect.width;
        const normalizedY = clickY / rect.height;

        const pixelX = Math.round(normalizedX * 511);
        const pixelY = Math.round(normalizedY * 511);

        // Center DC is at (256, 256) -> u (vertical) is +256 to -256, v (horizontal) is -256 to +256
        const freqU = 256 - pixelY;
        const freqV = pixelX - 256;

        let magnitude = null;
        let maskWeight = null;
        let referenceValue = null;

        // If backend returns real numeric point data matrix
        if (pointData?.available && pointData?.matrix) {
          magnitude = pointData.matrix[pixelY]?.[pixelX];
          maskWeight = pointData.maskMatrix?.[pixelY]?.[pixelX];
          referenceValue = pointData.refMatrix?.[pixelY]?.[pixelX];
        }

        setHoverData({
          u: freqU,
          v: freqV,
          x: pixelX,
          y: pixelY,
          magnitude,
          maskWeight,
          referenceValue,
        });
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  // Wheel zoom handler
  function handleWheel(e) {
    if (!isAvailable) return;
    if (e.ctrlKey || e.metaKey || isFullscreen) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  }

  // Keyboard Escape listener for fullscreen
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const explorerBody = (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header controls: Channel Tabs & Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <FrequencyChannelTabs
          activeChannel={activeChannel}
          onSelectChannel={setActiveChannel}
        />

        <FrequencyToolbar
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          disabled={!isAvailable}
        />
      </div>

      {/* Main Grid: Viewer + Parameters Sidebar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isFullscreen ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          alignItems: "stretch",
        }}
      >
        {/* Left Column: Frequency Spectrum Viewport */}
        <div style={{ flex: "1.8", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={viewportRef}
            className="sci-viewport-box"
            style={{
              width: "100%",
              height: isFullscreen ? "calc(100vh - 220px)" : "420px",
              cursor: zoom > 1 && isAvailable ? (isDragging ? "grabbing" : "grab") : "crosshair",
              overflow: "hidden",
              userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setIsDragging(false);
              setIsHovered(false);
            }}
            onWheel={handleWheel}
          >
            {/* Axis U (Vertical) */}
            <div className="sci-axis-u">
              <span>+256</span>
              <span>← Freq u →</span>
              <span>-256</span>
            </div>

            {/* Inner Viewport Frame */}
            <div
              ref={imageContainerRef}
              className="sci-viewport-inner"
              style={{
                width: isFullscreen ? "min(560px, 80vh)" : "100%",
                maxWidth: isFullscreen ? "560px" : "380px",
                aspectRatio: "1 / 1",
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
            >
              {/* Subtle Grid Guidelines */}
              <div className="sci-grid-lines">
                <div /><div /><div /><div />
                <div /><div /><div /><div />
                <div /><div /><div /><div />
                <div /><div /><div /><div />
              </div>

              {/* Central DC marker */}
              <div className="sci-dc-marker" title="Center DC (0,0)" />

              {/* Spectrum Image or Mock Placeholder */}
              {isAvailable && activeImage ? (
                <img
                  src={activeImage}
                  alt={`Frequency spectrum - ${activeChannel} channel`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
              ) : (
                <div className="sci-placeholder-state">
                  <Activity size={32} style={{ color: "#38bdf8", opacity: 0.8 }} />
                  <div className="sci-placeholder-title">
                    Frequency Explorer
                  </div>
                  <p className="sci-placeholder-desc">
                    Frequency data is not available in mock mode.
                  </p>
                  <div
                    className="mono"
                    style={{
                      marginTop: "12px",
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
                </div>
              )}
            </div>

            {/* Axis V (Horizontal) */}
            <div className="sci-axis-v" style={{ maxWidth: isFullscreen ? "560px" : "380px" }}>
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
            Figure 1.1: 2D FFT shifted log-magnitude spectrum · Centered zero-frequency DC(0, 0)
          </div>
        </div>

        {/* Right Column: Inspector Tooltip & Technical Parameters */}
        {!isFullscreen && (
          <div
            style={{
              flex: "1.2",
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 650,
                color: "var(--text-primary)",
                paddingBottom: "10px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <Layers size={16} style={{ color: "var(--accent-blue)" }} />
              <span>Spectrum Parameters</span>
            </div>

            {/* Hover Inspector Tooltip Readout */}
            <FrequencyTooltip
              channel={activeChannel}
              hoverData={hoverData}
              isHovered={isHovered}
            />

            {/* Parameters List */}
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
                  {metadata.representation || "log(1 + |F(u, v)|)"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)" }}>Transform</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {metadata.transform || "2D FFT"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)" }}>Shift Invariant</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {metadata.shift || "centered (fftshift)"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)" }}>Source Noise</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {metadata.source || "DnCNN residual"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)" }}>Spatial Dimensions</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {metadata.width || 512} × {metadata.height || 512} px
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
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
                <span>Inspection Guide</span>
              </div>
              Use zoom and pan controls to explore high-frequency coordinates. Stable Diffusion 1.4 latents display characteristic harmonic peaks at decimation grid harmonics.
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Inspector Bar */}
      {isFullscreen && (
        <div style={{ marginTop: "12px" }}>
          <FrequencyTooltip
            channel={activeChannel}
            hoverData={hoverData}
            isHovered={isHovered}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="card">
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
              Frequency Explorer
            </h2>
            <span className="navbar-badge" style={{ color: "var(--accent-blue)" }}>
              Interactive View
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Inspect the frequency-domain representation used by MaskSim during classification.
          </p>
        </div>

        {explorerBody}
      </div>

      {/* Fullscreen Modal Overlay */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Frequency Explorer"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "1100px",
              maxHeight: "96vh",
              overflowY: "auto",
              background: "var(--bg-surface)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Frequency Explorer — Fullscreen Mode
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  Press <kbd style={{ background: "var(--bg-subtle)", padding: "1px 5px", borderRadius: "3px", border: "1px solid var(--border-subtle)" }}>Esc</kbd> or click Close to return.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close fullscreen"
                className="btn-secondary"
                onClick={() => setIsFullscreen(false)}
                style={{ padding: "6px 12px" }}
              >
                <X size={16} />
                <span>Close</span>
              </button>
            </div>

            {explorerBody}
          </div>
        </div>
      )}
    </>
  );
}
