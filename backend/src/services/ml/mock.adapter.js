import crypto from "crypto";

export class MockMlAdapter {
  async predict({ file, includeExplainability, requestId }) {
    const digest = crypto.createHash("sha256").update(file.buffer).digest();
    const normalized = digest.readUInt16BE(0) / 65535;

    // Development-only deterministic score.
    const score = Number((0.08 + normalized * 0.88).toFixed(4));
    const threshold = 0.5;
    const similarity = Number((-0.2 + normalized * 1.0).toFixed(4));

    return {
      prediction: score >= threshold ? "AI_GENERATED" : "REAL",
      score,
      threshold,
      detector: {
        id: "stable-diffusion-1-4",
        name: "MaskSim SD1.4",
        version: "masksim-sd14-v1-mock",
      },
      input: {
        originalWidth: 1024,
        originalHeight: 1024,
        analyzedWidth: 512,
        analyzedHeight: 512,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
      analysis: {
        cosineSimilarity: similarity,
        inferenceMs: 38,
      },
      explainability: {
        available: false,
        note: includeExplainability
          ? "Mock mode does not generate forensic tensor artifacts."
          : "Explainability not requested.",
      },
      frequencyExplorer: {
        available: false,
        note: includeExplainability
          ? "Frequency data is not available in mock mode."
          : "Explainability not requested.",
        images: {
          combined: null,
          y: null,
          cb: null,
          cr: null,
        },
        metadata: {
          width: 512,
          height: 512,
          representation: "log-magnitude",
          transform: "2D FFT",
          shift: "centered",
          source: "DnCNN residual",
        },
        pointData: {
          available: false,
        },
      },
      internal: {
        mode: "mock",
        requestId,
      },
    };
  }
}
