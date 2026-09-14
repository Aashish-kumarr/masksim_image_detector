import PageHeader from "../components/common/PageHeader";
import { ArrowRight, Cpu, Layers, ShieldCheck, Database, Code, BookOpen, GitBranch } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "880px" }}>
      <PageHeader
        eyebrow="Research & Architecture"
        title="About MaskSim"
        description="A specialized frequency-domain forensic platform for detecting synthetic image artifacts with scientific interpretability."
      />

      {/* Problem & Motivation */}
      <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          The Forensic Challenge
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
          Diffusion models and neural generative architectures synthesize photorealistic imagery with seamless semantic coherence, rendering classical spatial visual cues (such as anatomical anomalies or lighting inconsistencies) increasingly obsolete.
        </p>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
          However, modern generative pipelines cannot completely hide the structural footprint of their neural upsampling operators. Convolutional transpose layers and sub-pixel decimation grids introduce periodic spatial correlations that leave distinct mathematical signatures in the frequency domain.
        </p>
      </section>

      {/* Why Frequency Domain & DnCNN */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          Methodology: Residuals & Frequency Spectra
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <div className="card-subtle">
            <h3 style={{ fontSize: "15px", fontWeight: 650, color: "var(--text-primary)", marginBottom: "6px" }}>
              Why DnCNN Residual Extraction?
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Raw pixel domains are dominated by low-frequency semantic scene structures (edges, shapes, lighting). DnCNN isolates the high-frequency spatial noise residual \( R = X - D(X) \), effectively stripping visible content while amplifying subtle sensor and generative artifacts.
            </p>
          </div>

          <div className="card-subtle">
            <h3 style={{ fontSize: "15px", fontWeight: 650, color: "var(--text-primary)", marginBottom: "6px" }}>
              Why 2D Fourier Analysis?
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Periodic spatial artifacts appear as localized peaks and harmonic lattice energy in the 2D Fast Fourier Transform (FFT). By analyzing the shifted log-magnitude spectrum, MaskSim measures spatial periodicity that remains invisible to human inspection.
            </p>
          </div>
        </div>
      </section>

      {/* System Architecture Diagram */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          System Architecture
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          MaskSim enforces a clean 4-tier separation of concerns, ensuring high security, deterministic inference, and decoupled microservice scalability:
        </p>

        {/* Architecture Flow Box */}
        <div
          className="card"
          style={{
            padding: "24px",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--bg-surface)" }}>
              <div className="mono" style={{ fontSize: "11px", color: "var(--accent-blue)", fontWeight: 700 }}>TIER 1</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>React UI</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Vite / SPA</div>
            </div>

            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
              <ArrowRight size={20} style={{ margin: "0 auto" }} />
            </div>

            <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--bg-surface)" }}>
              <div className="mono" style={{ fontSize: "11px", color: "var(--accent-blue)", fontWeight: 700 }}>TIER 2</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>Express API</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Node.js Backend</div>
            </div>

            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
              <ArrowRight size={20} style={{ margin: "0 auto" }} />
            </div>

            <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--bg-surface)" }}>
              <div className="mono" style={{ fontSize: "11px", color: "var(--accent-blue)", fontWeight: 700 }}>TIER 3</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>FastAPI</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>ML Service</div>
            </div>

            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
              <ArrowRight size={20} style={{ margin: "0 auto" }} />
            </div>

            <div className="card" style={{ padding: "16px", textAlign: "center", background: "var(--bg-surface)" }}>
              <div className="mono" style={{ fontSize: "11px", color: "var(--accent-blue)", fontWeight: 700 }}>TIER 4</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>PyTorch</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>DnCNN + MaskSim</div>
            </div>
          </div>

          <div style={{ fontSize: "12.5px", color: "var(--text-muted)", textAlign: "center" }}>
            The React frontend never directly calls the ML service or loads weights in the browser. In development, the Express backend utilizes a deterministic mock adapter until the real PyTorch model service is connected.
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          Technology Stack
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div className="card-subtle">
            <strong>Frontend</strong>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              React 19, Vite, React Router 7, Lucide Icons
            </div>
          </div>
          <div className="card-subtle">
            <strong>API Gateway</strong>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Node.js, Express 5, Multer, Helmet, CORS
            </div>
          </div>
          <div className="card-subtle">
            <strong>ML Service</strong>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Python 3.11, FastAPI, Uvicorn, Pydantic
            </div>
          </div>
          <div className="card-subtle">
            <strong>Inference Engine</strong>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              PyTorch 2.x, TorchVision, NumPy, SciPy FFT
            </div>
          </div>
        </div>
      </section>

      {/* Research References */}
      <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          Selected References
        </h2>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
          <li>
            Zhang et al., <em>Beyond a Gaussian Denoiser: Residual Learning of Deep CNN for Image Denoising (DnCNN)</em>, IEEE TIP, 2017.
          </li>
          <li>
            Frank et al., <em>Leveraging Frequency Analysis for Deep Fake Image Recognition</em>, ICML, 2020.
          </li>
          <li>
            Rombach et al., <em>High-Resolution Image Synthesis with Latent Diffusion Models</em>, CVPR, 2022.
          </li>
          <li>
            Corvi et al., <em>On the detection of synthetic images generated by diffusion models</em>, IEEE ICASSP, 2023.
          </li>
        </ul>
      </section>
    </div>
  );
}
