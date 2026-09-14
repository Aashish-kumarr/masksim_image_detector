import { mlService } from "../services/ml.service.js";
import { detectionService } from "../services/detection.service.js";

export async function createDetection(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: "NO_FILE", message: "Select an image first." },
        meta: { requestId: req.requestId },
      });
    }

    const includeExplainability = String(req.body.includeExplainability ?? "true") === "true";

    const mlResult = await mlService.predict({
      file: req.file,
      includeExplainability,
      requestId: req.requestId,
    });

    const saved = detectionService.save({
      result: mlResult,
      requestId: req.requestId,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: saved.id,
        ...mlResult,
      },
      meta: { requestId: req.requestId },
    });
  } catch (error) {
    next(error);
  }
}

export async function listDetections(req, res) {
  res.json({
    success: true,
    data: detectionService.list(),
    meta: {
      requestId: req.requestId,
      persistence: "memory-development-store",
    },
  });
}

export async function getDetection(req, res) {
  const record = detectionService.getById(req.params.id);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Analysis not found." },
      meta: { requestId: req.requestId },
    });
  }

  res.json({
    success: true,
    data: record,
    meta: { requestId: req.requestId },
  });
}
