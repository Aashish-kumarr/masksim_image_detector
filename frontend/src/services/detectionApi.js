import { apiRequest } from "./apiClient";

export function detectImage(file, includeExplainability = true) {
  const form = new FormData();
  form.append("image", file);
  form.append("includeExplainability", String(includeExplainability));

  return apiRequest("/v1/detections", {
    method: "POST",
    body: form,
  });
}

export function getDetections() {
  return apiRequest("/v1/detections");
}

export function getDetection(id) {
  return apiRequest(`/v1/detections/${id}`);
}
