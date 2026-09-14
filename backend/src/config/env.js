import "dotenv/config";

function number(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid numeric environment variable: ${name}`);
  return parsed;
}

export const env = {
  port: number("PORT", 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  mlMode: process.env.ML_MODE || "mock",
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://127.0.0.1:8000",
  mlServiceApiKey: process.env.ML_SERVICE_API_KEY || "",
  mlTimeoutMs: number("ML_TIMEOUT_MS", 30000),
  maxUploadMb: number("MAX_UPLOAD_MB", 10),
  mongoUri: process.env.MONGODB_URI || "",
};
