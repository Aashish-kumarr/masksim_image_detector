import multer from "multer";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found." },
    meta: { requestId: req.requestId },
  });
}

export function errorHandler(err, req, res, next) {
  console.error(`[${req.requestId}]`, err);

  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: { code: "FILE_TOO_LARGE", message: "The uploaded image exceeds the size limit." },
      meta: { requestId: req.requestId },
    });
  }

  if (err.code === "UNSUPPORTED_FORMAT") {
    return res.status(415).json({
      success: false,
      error: { code: "UNSUPPORTED_FORMAT", message: err.message },
      meta: { requestId: req.requestId },
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.publicMessage || "An unexpected error occurred.",
    },
    meta: { requestId: req.requestId },
  });
}
