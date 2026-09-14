import rateLimit from "express-rate-limit";

export const detectionRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many analysis requests. Please try again shortly."
    }
  }
});
