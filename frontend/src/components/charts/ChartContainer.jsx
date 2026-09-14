import { LineChart, BarChart3, TrendingUp, Info } from "lucide-react";

export default function ChartContainer({
  title,
  subtitle,
  children,
  empty = false,
  emptyMessage = "Full evaluation curve points will be plotted here when checkpoint data is loaded.",
  badge = null,
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          gap: "12px",
        }}
      >
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 650, color: "var(--text-primary)" }}>{title}</h4>
          {subtitle && (
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span
            className="mono"
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              background: "var(--bg-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {empty ? (
          <div
            style={{
              padding: "48px 24px",
              background: "var(--bg-subtle)",
              border: "1px dashed var(--border-default)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "8px",
              color: "var(--text-muted)",
              minHeight: "220px",
            }}
          >
            <LineChart size={28} style={{ opacity: 0.6 }} />
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Data Unavailable
            </div>
            <p style={{ fontSize: "12px", maxWidth: "280px", lineHeight: 1.5 }}>
              {emptyMessage}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
