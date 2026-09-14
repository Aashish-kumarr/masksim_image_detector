const ACCEPTED = new Set(["image/jpeg", "image/png"]);
const MAX_BYTES = 10 * 1024 * 1024;

export function validateImage(file) {
  if (!file) return "Select an image first.";
  if (!ACCEPTED.has(file.type)) return "Only JPEG and PNG images are supported.";
  if (file.size > MAX_BYTES) return "The image exceeds the 10 MB upload limit.";
  return null;
}
