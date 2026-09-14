import { Crosshair, Info } from "lucide-react";

export default function FrequencyTooltip({
  channel = "Combined",
  hoverData = null, // { u, v, x, y, magnitude, maskWeight, referenceValue }
  isHovered = false,
}) {
  if (!isHovered || !hoverData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          fontSize: "12px",
          color: "var(--text-muted)",
        }}
      >
        <Crosshair size={14} style={{ color: "var(--accent-blue)" }} />
        <span>Hover over the frequency spectrum viewport to inspect coordinate frequencies.</span>
      </div>
    );
  }

  const { u, v, x, y, magnitude, maskWeight, referenceValue } = hoverData;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "16px",
        padding: "8px 14px",
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        fontSize: "12.5px",
        color: "var(--text-secondary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Channel:</span>
        <span className="mono" style={{ color: "var(--accent-blue)", fontWeight: 700 }}>
          {channel}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Frequency (u, v):</span>
        <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          ({u >= 0 ? `+${u}` : u}, {v >= 0 ? `+${v}` : v})
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Pixel:</span>
        <span className="mono" style={{ color: "var(--text-muted)" }}>
          [{x}, {y}]
        </span>
      </div>

      {/* Only render actual backend numeric values if present */}
      {magnitude != null && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Log magnitude:</span>
          <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {Number(magnitude).toFixed(2)}
          </span>
        </div>
      )}

      {maskWeight != null && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Mask weight:</span>
          <span className="mono" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
            {Number(maskWeight).toFixed(2)}
          </span>
        </div>
      )}

      {referenceValue != null && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Reference value:</span>
          <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {Number(referenceValue).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
