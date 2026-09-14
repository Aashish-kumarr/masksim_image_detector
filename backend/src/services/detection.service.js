import crypto from "crypto";

const memoryStore = [];

export const detectionService = {
  save({ result, requestId, file }) {
    const id = crypto.randomUUID();
    const record = {
      id,
      requestId,
      prediction: result.prediction,
      score: result.score,
      threshold: result.threshold,
      detector: result.detector,
      input: {
        originalFileName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        originalWidth: result.input?.originalWidth,
        originalHeight: result.input?.originalHeight,
        analyzedWidth: result.input?.analyzedWidth,
        analyzedHeight: result.input?.analyzedHeight,
      },
      analysis: result.analysis,
      explainability: result.explainability,
      createdAt: new Date().toISOString(),
    };

    memoryStore.unshift(record);
    return record;
  },

  list() {
    return memoryStore;
  },

  getById(id) {
    return memoryStore.find((item) => item.id === id) || null;
  },
};
