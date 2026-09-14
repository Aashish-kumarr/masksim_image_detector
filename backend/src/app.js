import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middleware/requestId.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { detectionRouter } from "./routes/detection.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { healthRouter } from "./routes/health.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: env.frontendOrigin,
  credentials: true,
}));
app.use(requestIdMiddleware);
app.use(express.json({ limit: "1mb" }));

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/detections", detectionRouter);
app.use("/api/v1/project", projectRouter);

app.use(notFound);
app.use(errorHandler);
