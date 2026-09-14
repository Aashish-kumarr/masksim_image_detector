import { Router } from "express";
import { env } from "../config/env.js";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      backend: "ok",
      mlMode: env.mlMode,
    },
    meta: { requestId: req.requestId },
  });
});
