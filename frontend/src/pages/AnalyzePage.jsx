import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import ImageDropzone from "../components/detector/ImageDropzone";
import ImagePreview from "../components/detector/ImagePreview";
import ResultSummary from "../components/detector/ResultSummary";
import ScientificVisualizationViewer from "../components/forensic/ScientificVisualizationViewer";
import ForensicTabs from "../components/forensic/ForensicTabs";
import { useImagePreview } from "../hooks/useImagePreview";
import { validateImage } from "../utils/validateImage";
import { detectImage } from "../services/detectionApi";
import { AlertCircle } from "lucide-react";

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const previewUrl = useImagePreview(file);

  function handleFileSelect(selectedFile) {
    const validationError = validateImage(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setResult(null);
      return;
    }

    setError(null);
    setResult(null);
    setFile(selectedFile);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // Send to Express /api/v1/detections with includeExplainability = true
      const response = await detectImage(file, true);
      setResult(response);
    } catch (err) {
      setError(err.message || "Forensic analysis failed. Please verify the backend service is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setError(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader
        eyebrow="Forensic Detection"
        title="Analyze an image"
        description="Upload an image to inspect residual and frequency-domain characteristics using the MaskSim pipeline."
      />

      {error && (
        <div
          className="notice-box notice-warning"
          role="alert"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STATE 1: Empty Upload State */}
      {!file && !result && (
        <ImageDropzone onFile={handleFileSelect} />
      )}

      {/* STATE 2 & 3: Selected / Loading State */}
      {file && !result && (
        <ImagePreview
          file={file}
          previewUrl={previewUrl}
          loading={loading}
          onAnalyze={handleAnalyze}
          onReplace={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/png, image/jpeg";
            input.onchange = (e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            };
            input.click();
          }}
          onRemove={handleReset}
        />
      )}

      {/* STATE 4: Result State */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Top Result Summary */}
          <ResultSummary
            result={result}
            file={file}
            previewUrl={previewUrl}
            onReset={handleReset}
          />

          {/* Section 2: Frequency Analysis */}
          <div className="card">
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Frequency analysis
                </h2>
                <span className="navbar-badge" style={{ color: "var(--accent-blue)" }}>
                  Spectral Residual
                </span>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                The spectrum below represents the frequency-domain signal extracted from the DnCNN residual and analyzed by MaskSim.
              </p>
            </div>

            <ScientificVisualizationViewer
              title="2D FFT Shifted Log-Magnitude Spectrum"
              subtitle="Figure 1.1: Normalized 2D Fast Fourier Transform shifted spectrum of the DnCNN noise residual."
              available={Boolean(result.explainability?.available)}
              images={{
                combined: result.explainability?.spectrumCombined,
                y: result.explainability?.spectrumY,
                cb: result.explainability?.spectrumCb,
                cr: result.explainability?.spectrumCr,
              }}
              note={result.explainability?.note}
              source="DnCNN residual"
              transform="2D-RFFT Centered Shifted"
              representation="log(1 + |F(u, v)|)"
              resolution="512 × 512 px"
              sidebarTitle="Spectrum Details"
            />
          </div>

          {/* Section 3: Forensic Tabs */}
          <ForensicTabs
            result={result}
            file={file}
            previewUrl={previewUrl}
          />
        </div>
      )}
    </div>
  );
}
