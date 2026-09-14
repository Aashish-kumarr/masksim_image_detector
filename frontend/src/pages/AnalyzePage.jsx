import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import ImageDropzone from "../components/detector/ImageDropzone";
import ImagePreview from "../components/detector/ImagePreview";
import ResultSummary from "../components/detector/ResultSummary";
import FrequencyExplorer from "../components/forensic/FrequencyExplorer";
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

          {/* Section 2: Interactive Frequency Explorer */}
          <FrequencyExplorer
            frequencyExplorer={result.frequencyExplorer}
            explainability={result.explainability}
            result={result}
          />

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
