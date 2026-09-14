export default function ConfusionMatrix({ matrix = [[133, 15], [9, 139]] }) {
  const tn = matrix[0]?.[0] ?? 133;
  const fp = matrix[0]?.[1] ?? 15;
  const fn = matrix[1]?.[0] ?? 9;
  const tp = matrix[1]?.[1] ?? 139;

  const totalReal = tn + fp;
  const totalSynthetic = fn + tp;
  const grandTotal = totalReal + totalSynthetic;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 650, color: "var(--text-primary)" }}>
          Confusion Matrix (Test Set, N = {grandTotal})
        </h4>
        <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Threshold = 0.5000
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "8px", alignItems: "center" }}>
        {/* Top Header Row (Predicted) */}
        <div />
        <div style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
          Predicted Real
        </div>
        <div style={{ textAlign: "center", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
          Predicted Synthetic
        </div>

        {/* Row 1: Actual Real */}
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textAlign: "right", paddingRight: "8px" }}>
          Actual Real
        </div>
        {/* TN Cell */}
        <div
          style={{
            background: "var(--bg-real)",
            border: "1px solid var(--border-real)",
            borderRadius: "var(--radius-md)",
            padding: "16px 12px",
            textAlign: "center",
          }}
        >
          <div className="mono" style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-real)" }}>
            {tn}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
            True Negative ({((tn / totalReal) * 100).toFixed(1)}%)
          </div>
        </div>
        {/* FP Cell */}
        <div
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "16px 12px",
            textAlign: "center",
          }}
        >
          <div className="mono" style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-muted)" }}>
            {fp}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
            False Positive ({((fp / totalReal) * 100).toFixed(1)}%)
          </div>
        </div>

        {/* Row 2: Actual Synthetic */}
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textAlign: "right", paddingRight: "8px" }}>
          Actual Synthetic
        </div>
        {/* FN Cell */}
        <div
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "16px 12px",
            textAlign: "center",
          }}
        >
          <div className="mono" style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-muted)" }}>
            {fn}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
            False Negative ({((fn / totalSynthetic) * 100).toFixed(1)}%)
          </div>
        </div>
        {/* TP Cell */}
        <div
          style={{
            background: "var(--bg-synthetic)",
            border: "1px solid var(--border-synthetic)",
            borderRadius: "var(--radius-md)",
            padding: "16px 12px",
            textAlign: "center",
          }}
        >
          <div className="mono" style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-synthetic)" }}>
            {tp}
          </div>
          <div style={{ fontSize: "11px", color: "var(--color-synthetic)", marginTop: "2px" }}>
            True Positive ({((tp / totalSynthetic) * 100).toFixed(1)}%)
          </div>
        </div>
      </div>
    </div>
  );
}
