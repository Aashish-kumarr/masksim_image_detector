const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const payload = await response.json().catch(() => ({
    success: false,
    error: { code: "INVALID_RESPONSE", message: "The server returned an invalid response." },
  }));

  if (!response.ok || payload.success === false) {
    const error = new Error(payload.error?.message || "Request failed.");
    error.code = payload.error?.code || "REQUEST_FAILED";
    error.payload = payload;
    throw error;
  }

  return payload.data !== undefined ? payload.data : payload;
}
