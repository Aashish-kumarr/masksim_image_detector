import PageHeader from "../components/common/PageHeader";
import { AlertTriangle, ShieldAlert, Cpu, Sparkles, Filter, FileText } from "lucide-react";

export default function LimitationsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px", maxWidth: "860px" }}>
      <PageHeader
        eyebrow="Analytical Boundaries"
        title="Limitations & Forensic Scope"
        description="Understanding the technical boundaries, generator specificity, and interpretation criteria for MaskSim detections."
      />

      {/* Primary Scope Notice */}
      <div className="notice-box notice-warning" style={{ fontSize: "13.5px" }}>
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Essential Guidance:</strong> MaskSim produces analytical forensic evidence, not definitive proof of image provenance. Detection outputs should always be combined with provenance metadata, contextual analysis, and secondary forensic tools.
        </div>
      </div>

      {/* Section 1: Generator Architecture Specificity */}
      <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          1. Current Model Scope & Generator Specificity
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          The current model checkpoint (<code>masksim-sd14-v1</code>) is specifically optimized to detect the spectral noise fingerprints left by the <strong>Stable Diffusion 1.4</strong> latent autoencoder.
        </p>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Latent diffusion architectures utilize spatial autoencoders with 8× downsampling and upsampling deconvolution operations. The learned frequency mask is specifically tuned to the decimation grid lattice frequencies produced by this autoencoder.
        </p>
      </section>

      {/* Section 2: Unseen Generative Models */}
      <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          2. Generalization to Unseen Generators
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Detection accuracy may degrade significantly on content produced by different diffusion architectures, GANs, or newer generative foundations:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {["Stable Diffusion XL / SD3", "Midjourney (v5 / v6)", "DALL-E 2 / DALL-E 3", "Adobe Firefly", "FLUX.1 (Black Forest Labs)", "Future Foundation Models"].map((gen) => (
            <div key={gen} className="card-subtle" style={{ padding: "12px 14px", fontSize: "13px" }}>
              <strong style={{ color: "var(--text-primary)" }}>{gen}</strong>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                Independent autoencoder fingerprint
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "8px" }}>
          Different autoencoders have unique stride rates, filter counts, and upsampling kernels, which produce distinct frequency profiles that may not align with the SD1.4 learned reference.
        </p>
      </section>

      {/* Section 3: Image Transformations & Post-Processing */}
      <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          3. Impact of Post-Processing & Degradations
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          High-frequency forensic signals are delicate. Standard image processing pipelines can mask or destroy the diagnostic frequencies:
        </p>
        <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
          <li>
            <strong>Lossy JPEG Recompression:</strong> Quantization tables in lossy JPEG encoding discard high-frequency DCT coefficients, substantially attenuating the subtle spectral peaks analyzed by MaskSim.
          </li>
          <li>
            <strong>Resizing & Resampling:</strong> Spatial scaling filters (bilinear, Lanczos, bicubic) introduce low-pass smoothing and grid harmonics that obscure authentic camera sensor noise and AI fingerprints alike.
          </li>
          <li>
            <strong>Screenshots & Screen Captures:</strong> Display rendering, sub-pixel antialiasing, and OS color management alter the spatial pixel matrix.
          </li>
          <li>
            <strong>Aggressive Social Media Compression:</strong> Platforms such as Twitter/X, Instagram, and WhatsApp recompress and resize media upon upload.
          </li>
          <li>
            <strong>Heavy Denoising & Beauty Filters:</strong> Spatial smoothing filters suppress residual high-frequency information.
          </li>
        </ul>
      </section>

      {/* Section 4: Interpretation & False Decisions */}
      <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
          4. False Positives, False Negatives & Interpretation
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          No detector achieves 100% universal accuracy. Users must account for both error modes:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginTop: "8px" }}>
          <div className="card-subtle">
            <h4 style={{ fontSize: "14px", fontWeight: 650, color: "var(--text-primary)", marginBottom: "4px" }}>
              False Positives (False Alarms)
            </h4>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Authentic camera images featuring repetitive physical patterns (e.g. fabric weaves, architectural mesh, window screens) or digital camera anti-aliasing artifacts can occasionally exhibit high-frequency peaks that trigger detection.
            </p>
          </div>

          <div className="card-subtle">
            <h4 style={{ fontSize: "14px", fontWeight: 650, color: "var(--text-primary)", marginBottom: "4px" }}>
              False Negatives (Missed Detections)
            </h4>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Synthetic images subjected to heavy blur, downscaling below 512px, or strong JPEG compression (Q &lt; 75) may have their generative fingerprint eliminated, yielding a false "Likely Real" score.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
