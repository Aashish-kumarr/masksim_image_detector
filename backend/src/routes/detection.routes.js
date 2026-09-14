import { Router } from "express";
import { upload } from "../middleware/upload.middleware.js";
import { detectionRateLimit } from "../middleware/rateLimit.middleware.js";
import {
  createDetection,
  listDetections,
  getDetection,
} from "../controllers/detection.controller.js";

export const detectionRouter = Router();

detectionRouter.get("/", listDetections);
detectionRouter.get("/:id", getDetection);
detectionRouter.post(
  "/",
  detectionRateLimit,
  upload.single("image"),
  createDetection
);
