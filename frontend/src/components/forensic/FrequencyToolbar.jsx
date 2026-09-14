import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from "lucide-react";

export default function FrequencyToolbar({
  zoom = 1,
  minZoom = 1,
  maxZoom = 8,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen = false,
  onToggleFullscreen,
  disabled = false,
}) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "3px 6px",
      }}
    >
      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in (+)"
        disabled={disabled || zoom >= maxZoom}
        onClick={onZoomIn}
        className="btn-ghost"
        style={{
          padding: "5px 8px",
          borderRadius: "var(--radius-sm)",
          opacity: disabled || zoom >= maxZoom ? 0.4 : 1,
          cursor: disabled || zoom >= maxZoom ? "not-allowed" : "pointer",
        }}
      >
        <ZoomIn size={15} />
      </button>

      <span
        className="mono"
        style={{
          fontSize: "11.5px",
          fontWeight: 600,
          color: "var(--text-primary)",
          minWidth: "44px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {zoomPercent}%
      </span>

      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out (-)"
        disabled={disabled || zoom <= minZoom}
        onClick={onZoomOut}
        className="btn-ghost"
        style={{
          padding: "5px 8px",
          borderRadius: "var(--radius-sm)",
          opacity: disabled || zoom <= minZoom ? 0.4 : 1,
          cursor: disabled || zoom <= minZoom ? "not-allowed" : "pointer",
        }}
      >
        <ZoomOut size={15} />
      </button>

      <div
        style={{
          width: "1px",
          height: "16px",
          background: "var(--border-subtle)",
          margin: "0 2px",
        }}
      />

      <button
        type="button"
        aria-label="Reset zoom and center view"
        title="Reset zoom"
        disabled={disabled || (zoom === 1 && !isFullscreen)}
        onClick={onResetZoom}
        className="btn-ghost"
        style={{
          padding: "5px 8px",
          borderRadius: "var(--radius-sm)",
          fontSize: "12px",
          opacity: disabled || (zoom === 1 && !isFullscreen) ? 0.4 : 1,
          cursor: disabled || (zoom === 1 && !isFullscreen) ? "not-allowed" : "pointer",
        }}
      >
        <RotateCcw size={13} style={{ marginRight: "4px" }} />
        <span>Fit</span>
      </button>

      <button
        type="button"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen viewer"}
        disabled={disabled}
        onClick={onToggleFullscreen}
        className="btn-ghost"
        style={{
          padding: "5px 8px",
          borderRadius: "var(--radius-sm)",
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          color: isFullscreen ? "var(--accent-blue)" : "inherit",
        }}
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>
    </div>
  );
}
