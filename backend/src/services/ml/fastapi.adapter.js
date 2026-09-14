import { env } from "../../config/env.js";

export class FastApiMlAdapter {
  async predict({ file, includeExplainability, requestId }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), env.mlTimeoutMs);

    try {
      const form = new FormData();
      form.append("image", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
      form.append("includeExplainability", String(includeExplainability));

      const headers = { "X-Request-ID": requestId };
      if (env.mlServiceApiKey) headers["X-Internal-API-Key"] = env.mlServiceApiKey;

      const response = await fetch(`${env.mlServiceUrl}/v1/predict`, {
        method: "POST",
        headers,
        body: form,
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload) {
        const error = new Error("ML service returned an invalid response.");
        error.code = response.status === 503 ? "ML_SERVICE_UNAVAILABLE" : "INFERENCE_FAILED";
        error.status = response.status >= 400 && response.status < 500 ? response.status : 502;
        error.publicMessage = payload?.error?.message || "Unable to analyze image.";
        throw error;
      }

      return payload.data ?? payload;
    } catch (err) {
      if (err.name === "AbortError") {
        const timeout = new Error("ML service timeout");
        timeout.code = "INFERENCE_TIMEOUT";
        timeout.status = 504;
        timeout.publicMessage = "Image analysis timed out.";
        throw timeout;
      }

      if (err.code) throw err;

      const unavailable = new Error("ML service unavailable");
      unavailable.code = "ML_SERVICE_UNAVAILABLE";
      unavailable.status = 503;
      unavailable.publicMessage = "Image analysis service is temporarily unavailable.";
      throw unavailable;
    } finally {
      clearTimeout(timer);
    }
  }
}
