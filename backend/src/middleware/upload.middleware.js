import multer from "multer";
import { env } from "../config/env.js";

const allowed = new Set(["image/jpeg", "image/png"]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!allowed.has(file.mimetype)) {
      const error = new Error("Only JPEG and PNG images are supported.");
      error.code = "UNSUPPORTED_FORMAT";
      return cb(error);
    }
    cb(null, true);
  },
});
