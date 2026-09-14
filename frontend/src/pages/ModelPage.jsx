import { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader";
import { getProjectModel } from "../services/projectApi";
import { Cpu, Layers, Shield, FileText, CheckCircle2 } from "lucide-react";

export default function ModelPage() {
  const [modelData, setModelData] = useState({
    name: "MaskSim SD1.4",
    version: "masksim-sd14-v1",
    inputSize: 512,
    colorSpace: "YCbCr",
    dncnnLayers: 20,
    dncnnParameters: 668227,
    maskSimParameters: 1572884,
    totalOptimizedParameters: 2241111,
    threshold: 0.5,
    generatorFocus: "Stable Diffusion 1.4",
  });

  useEffect(() => {
    getProjectModel()
      .then((res) => {
        if (res && res.name) {
          setModelData(res);
        }
      })
      .catch(() => {
        // Fallback to static model specifications
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      <PageHeader
        eyebrow="Model Architecture & Specification"
        title="MaskSim SD1.4 Model Card"
        description="Comprehensive architecture parameters, layer configurations, and operational invariants for the MaskSim forensic detector."
      />

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="card-subtle">
          <div style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Target Generator
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>
            {modelData.generatorFocus}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            CompVis / RunwayML SD 1.4
          </div>
        </div>

        <div className="card-subtle">
          <div style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Input Crop Window
          </div>
          <div className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>
            {modelData.inputSize} × {modelData.inputSize} px
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Deterministic Center Crop
          </div>
        </div>

        <div className="card-subtle">
          <div style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Decision Threshold
          </div>
          <div className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>
            {Number(modelData.threshold).toFixed(4)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            ROC Balanced Operating Point
          </div>
        </div>

        <div className="card-subtle">
          <div style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Total Parameters
          </div>
          <div className="mono" style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>
            {Number(modelData.totalOptimizedParameters).toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            DnCNN + MaskSim Heads
          </div>
        </div>
      </div>

      {/* Stage 1: DnCNN Residual Sub-Network */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="page-eyebrow">Stage 1 · Residual Extractor</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
              DnCNN Denoising Residual Network
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Residual convolutional sub-network trained to predict image noise R = X - D(X).
            </p>
          </div>
          <span className="navbar-badge">FROZEN WEIGHTS</span>
        </div>

        <div className="definition-matrix">
          <div className="matrix-column">
            <div className="matrix-row">
              <span className="matrix-label">Convolutional Layers</span>
              <span className="matrix-value">20 deep residual layers</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Input / Output Channels</span>
              <span className="matrix-value">3 (YCbCr) → 64 → 3 (YCbCr)</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Kernel Size</span>
              <span className="matrix-value">3 × 3 with zero-padding (stride = 1)</span>
            </div>
          </div>

          <div className="matrix-column">
            <div className="matrix-row">
              <span className="matrix-label">Intermediate Activations</span>
              <span className="matrix-value">Batch Normalization + ReLU</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Sub-network Parameters</span>
              <span className="matrix-value">{Number(modelData.dncnnParameters).toLocaleString()} params</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Execution Mode</span>
              <span className="matrix-value">PyTorch eval() / torch.inference_mode()</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 2: MaskSim Frequency Classifier */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="page-eyebrow">Stage 2 · Frequency Classifier</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
              MaskSim Frequency Attention & Cosine Classifier
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Learned 2D spectral mask attention, canonical archetype comparison, and score projection.
            </p>
          </div>
          <span className="navbar-badge" style={{ color: "var(--accent-blue)" }}>OPTIMIZED HEAD</span>
        </div>

        <div className="definition-matrix">
          <div className="matrix-column">
            <div className="matrix-row">
              <span className="matrix-label">Frequency Transform</span>
              <span className="matrix-value">2D-FFT with norm="ortho"</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Shift Invariant</span>
              <span className="matrix-value">fftshift (DC centered at (0, 0))</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Magnitude Formulation</span>
              <span className="matrix-value">log(1 + |F(u, v)|)</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Attention Layer</span>
              <span className="matrix-value">1×1 Conv → BatchNorm → Sigmoid</span>
            </div>
          </div>

          <div className="matrix-column">
            <div className="matrix-row">
              <span className="matrix-label">Learned Reference Vector</span>
              <span className="matrix-value">Canonical prototype [3, 512, 512]</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Similarity Metric</span>
              <span className="matrix-value">Vector Cosine Similarity cos(θ)</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Sub-network Parameters</span>
              <span className="matrix-value">{Number(modelData.maskSimParameters).toLocaleString()} params</span>
            </div>
            <div className="matrix-row">
              <span className="matrix-label">Output Activation</span>
              <span className="matrix-value">Calibrated Logistic Sigmoid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
