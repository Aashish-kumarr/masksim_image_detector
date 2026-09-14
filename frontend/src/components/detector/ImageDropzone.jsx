import { useRef, useState } from "react";
import { UploadCloud, Image, ShieldCheck, Lock } from "lucide-react";

export default function ImageDropzone({ onFile }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  }

  function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      onFile(e.target.files[0]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        className={`dropzone ${isDragOver ? "dragover" : ""}`}
        tabIndex={0}
        role="button"
        aria-label="Upload an image for analysis"
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-full)",
            background: "var(--accent-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-blue)",
            marginBottom: "16px",
          }}
        >
          <UploadCloud size={28} />
        </div>

        <div style={{ fontSize: "16px", fontWeight: 650, color: "var(--text-primary)", marginBottom: "4px" }}>
          Drop image here or <span style={{ color: "var(--accent-blue)", textDecoration: "underline" }}>browse image</span>
        </div>

        <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "12px" }}>
          JPEG or PNG · Minimum 512×512 px · Maximum 10 MB
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <Lock size={12} />
          <span>Images are processed for analysis and are not permanently stored by default.</span>
        </div>
      </div>

      {/* Model Spec Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "12px 20px",
          background: "var(--bg-subtle)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          fontSize: "13px",
          color: "var(--text-secondary)",
          gap: "12px",
        }}
      >
        <div>
          <span>Detector: </span>
          <strong style={{ color: "var(--text-primary)" }}>MaskSim SD1.4</strong>
        </div>
        <div>
          <span>Model input: </span>
          <strong className="mono" style={{ color: "var(--text-primary)" }}>512 × 512 px</strong>
        </div>
        <div>
          <span>Decision threshold: </span>
          <strong className="mono" style={{ color: "var(--text-primary)" }}>0.5000</strong>
        </div>
      </div>
    </div>
  );
}
