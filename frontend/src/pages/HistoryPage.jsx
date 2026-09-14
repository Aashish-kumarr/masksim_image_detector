import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import { getDetections } from "../services/detectionApi";
import { History, ExternalLink, ShieldCheck, AlertTriangle, Filter, Lock } from "lucide-react";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL"); // 'ALL' | 'REAL' | 'SYNTHETIC'

  useEffect(() => {
    getDetections()
      .then((res) => {
        if (Array.isArray(res)) {
          setHistoryItems(res);
        } else if (res && Array.isArray(res.data)) {
          setHistoryItems(res.data);
        }
      })
      .catch(() => {
        // In-memory history empty or unavailable
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredItems = historyItems.filter((item) => {
    const isSynthetic = item.prediction === "AI_GENERATED" || (item.score != null && item.score >= (item.threshold || 0.5));
    if (activeFilter === "REAL") return !isSynthetic;
    if (activeFilter === "SYNTHETIC") return isSynthetic;
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <PageHeader
        eyebrow="Session Audit Trail"
        title="Analysis History"
        description="Chronological record of recent forensic evaluations performed in the current browser session."
        actions={
          <div className="tab-nav" role="tablist">
            <button
              type="button"
              className={`tab-btn ${activeFilter === "ALL" ? "active" : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              All ({historyItems.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeFilter === "REAL" ? "active" : ""}`}
              onClick={() => setActiveFilter("REAL")}
            >
              Likely Real
            </button>
            <button
              type="button"
              className={`tab-btn ${activeFilter === "SYNTHETIC" ? "active" : ""}`}
              onClick={() => setActiveFilter("SYNTHETIC")}
            >
              Synthetic
            </button>
          </div>
        }
      />

      {/* Privacy Notice */}
      <div className="notice-box notice-info" style={{ fontSize: "12.5px" }}>
        <Lock size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Privacy Policy:</strong> Image byte payloads are not permanently stored by default. Only derived forensic metadata, hashes, and detector scores are retained in session memory.
        </div>
      </div>

      {/* Data Table */}
      {filteredItems.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "56px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <History size={36} style={{ color: "var(--text-muted)", opacity: 0.6 }} />
          <h3 style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)" }}>
            {historyItems.length === 0 ? "No analysis sessions recorded yet" : "No matching analyses for filter"}
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", maxWidth: "420px" }}>
            {historyItems.length === 0
              ? "Upload an image in the analysis workspace to generate your first forensic session."
              : "Try selecting a different filter above to view recorded analyses."}
          </p>
          {historyItems.length === 0 && (
            <Link to="/analyze" className="btn-primary" style={{ marginTop: "8px" }}>
              Analyze an Image
            </Link>
          )}
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Prediction</th>
                <th>Detector Score</th>
                <th>Model Version</th>
                <th>Dimensions</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const score = Number(item.score || 0);
                const isSynthetic = item.prediction === "AI_GENERATED" || score >= (item.threshold || 0.5);
                const input = item.input || {};
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recent session";

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {input.originalFileName || item.file?.name || `specimen_${item.id?.slice(0, 6)}`}
                      </div>
                      <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        ID: {item.id?.slice(0, 10)}
                      </div>
                    </td>

                    <td>
                      <div className={isSynthetic ? "badge-synthetic" : "badge-real"}>
                        <span className="badge-dot" />
                        <span>{isSynthetic ? "Synthetic" : "Likely Real"}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className="mono"
                        style={{
                          fontWeight: 700,
                          color: isSynthetic ? "var(--color-synthetic)" : "var(--color-real)",
                        }}
                      >
                        {score.toFixed(4)}
                      </span>
                    </td>

                    <td>
                      <span className="mono" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {item.detector?.version || "masksim-sd14-v1"}
                      </span>
                    </td>

                    <td>
                      <span className="mono" style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {input.originalWidth && input.originalHeight
                          ? `${input.originalWidth} × ${input.originalHeight}`
                          : "512 × 512"}
                      </span>
                    </td>

                    <td style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                      {dateStr}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <Link
                        to={`/analysis/${item.id}`}
                        className="btn-ghost"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px" }}
                      >
                        <span>Open analysis</span>
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
