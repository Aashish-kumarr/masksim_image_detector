import { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader";
import { getProjectDataset } from "../services/projectApi";
import { Database, Image, Check, Info } from "lucide-react";

export default function DatasetPage() {
  const [datasetData, setDatasetData] = useState({
    realDataset: "RAISE-1k",
    syntheticDataset: "Synthbuster",
    generator: "Stable Diffusion 1.4",
    train: { real: 691, synthetic: 691, total: 1382 },
    validation: { real: 148, synthetic: 148, total: 296 },
    test: { real: 148, synthetic: 148, total: 296 },
  });

  useEffect(() => {
    getProjectDataset()
      .then((res) => {
        if (res && res.realDataset) {
          setDatasetData(res);
        }
      })
      .catch(() => {
        // Fallback to static values
      });
  }, []);

  const totalPairs = 987;
  const grandTotalImages =
    (datasetData.train?.total || 1382) +
    (datasetData.validation?.total || 296) +
    (datasetData.test?.total || 296);

  const splits = [
    {
      name: "Training Split",
      real: datasetData.train?.real || 691,
      synthetic: datasetData.train?.synthetic || 691,
      total: datasetData.train?.total || 1382,
      percentage: ((datasetData.train?.total || 1382) / grandTotalImages) * 100,
      description: "Optimizes the 2D frequency attention mask and canonical synthetic reference vector.",
    },
    {
      name: "Validation Split",
      real: datasetData.validation?.real || 148,
      synthetic: datasetData.validation?.synthetic || 148,
      total: datasetData.validation?.total || 296,
      percentage: ((datasetData.validation?.total || 296) / grandTotalImages) * 100,
      description: "Hyperparameter tuning, early stopping, and decision threshold calibration (α = 0.01).",
    },
    {
      name: "Test Split (Held-Out)",
      real: datasetData.test?.real || 148,
      synthetic: datasetData.test?.synthetic || 148,
      total: datasetData.test?.total || 296,
      percentage: ((datasetData.test?.total || 296) / grandTotalImages) * 100,
      description: "Strictly held-out evaluation for reporting final AUC, accuracy, precision, and recall.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      <PageHeader
        eyebrow="Data Provenance & Partitions"
        title="Dataset Splits & Curation"
        description="Matched authentic and synthetic image corpus used for MaskSim training, validation, and benchmarking."
      />

      {/* Dataset Sources Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-real)" }} />
            <div className="page-eyebrow" style={{ color: "var(--color-real)", marginBottom: 0 }}>
              Authentic Source
            </div>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
            {datasetData.realDataset}
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
            Raw Images Dataset of 1,000 uncompressed authentic camera photos direct from sensors. Provides pristine, unadulterated sensor PRNU noise patterns.
          </p>
          <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
            Resolution: Up to 4288 × 2848 px · TIFF/RAW
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-synthetic)" }} />
            <div className="page-eyebrow" style={{ color: "var(--color-synthetic)", marginBottom: 0 }}>
              Synthetic Source
            </div>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
            {datasetData.syntheticDataset} ({datasetData.generator})
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
            Curated subset generated with Stable Diffusion 1.4 using standard 50-step DDIM sampling. Preserves latent decimation grid upsampling artifacts.
          </p>
          <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
            Resolution: 512 × 512 px · PNG Lossless
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-blue)" }} />
            <div className="page-eyebrow" style={{ color: "var(--accent-blue)", marginBottom: 0 }}>
              Balanced Corpus
            </div>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
            {totalPairs} Matched Pairs
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
            Each split maintains a strict 1:1 balance between authentic and synthetic specimens, eliminating prior probability bias during model optimization.
          </p>
          <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
            Total Corpus: {grandTotalImages} Evaluated Patches
          </div>
        </div>
      </div>

      {/* Clean Horizontal Partition Bars */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>
            Partition Distribution
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Proportionate split allocation across training, validation, and held-out test sets.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {splits.map((split) => (
            <div key={split.name} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13.5px" }}>
                <div>
                  <strong style={{ color: "var(--text-primary)" }}>{split.name}</strong>
                  <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>
                    ({split.percentage.toFixed(1)}% of total corpus)
                  </span>
                </div>
                <span className="mono" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {split.total} samples ({split.real} Real / {split.synthetic} Synthetic)
                </span>
              </div>

              {/* Horizontal Bar */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "12px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {/* Real portion */}
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    background: "var(--color-real)",
                    opacity: 0.85,
                  }}
                  title={`${split.real} Real`}
                />
                {/* Synthetic portion */}
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    background: "var(--color-synthetic)",
                    opacity: 0.85,
                  }}
                  title={`${split.synthetic} Synthetic`}
                />
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {split.description}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "24px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", fontSize: "12.5px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--color-real)" }} />
            <span>Authentic (RAISE-1k)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--color-synthetic)" }} />
            <span>Synthetic (Synthbuster SD1.4)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
