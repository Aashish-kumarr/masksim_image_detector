import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import ResultSummary from "../components/detector/ResultSummary";
import FrequencyExplorer from "../components/forensic/FrequencyExplorer";
import ForensicTabs from "../components/forensic/ForensicTabs";
import { getDetection } from "../services/detectionApi";
import { ChevronRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function AnalysisPage() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getDetection(id)
      .then((data) => {
        if (isMounted) {
          setRecord(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load analysis record.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "12px",
          color: "var(--text-secondary)",
        }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-blue)" }} />
        <div style={{ fontSize: "15px", fontWeight: 500 }}>Loading analysis specimen #{id}…</div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <PageHeader
          eyebrow="Record Lookup"
          title="Analysis Not Found"
          description={`Could not retrieve analysis record ${id}. It may have expired from the in-memory store or does not exist.`}
        />
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <AlertCircle size={36} style={{ color: "var(--color-synthetic)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 650, color: "var(--text-primary)" }}>
            Analysis Specimen Unavailable
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "440px", margin: "8px auto 24px" }}>
            The requested analysis session was not found. Please upload a new image for forensic evaluation.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/analyze" className="btn-primary">
              Analyze New Image
            </Link>
            <Link to="/history" className="btn-secondary">
              View History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Result object can be nested in record.result or directly in record
  const result = record.result || record;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Breadcrumb & Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
          <Link to="/history" style={{ color: "var(--text-secondary)" }} className="hover:text-primary">
            Forensic History
          </Link>
          <ChevronRight size={14} />
          <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            SESSION_{id?.slice(0, 8)}
          </span>
          {record.requestId && (
            <span className="navbar-badge" style={{ marginLeft: "6px" }}>
              REQ: {record.requestId.slice(0, 8)}
            </span>
          )}
        </div>

        <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-real)" }} />
          <span>Pipeline: Completed</span>
        </div>
      </div>

      {/* Top Result Summary */}
      <ResultSummary
        result={result}
        file={{ name: record.originalFileName || "specimen_image.png" }}
        previewUrl=""
      />

      {/* Section 2: Interactive Frequency Explorer */}
      <FrequencyExplorer
        frequencyExplorer={result.frequencyExplorer}
        explainability={result.explainability}
        result={result}
      />

      {/* Section 3: Forensic Tabs Suite */}
      <ForensicTabs
        result={result}
        file={{ name: record.originalFileName || "specimen_image.png" }}
      />
    </div>
  );
}
