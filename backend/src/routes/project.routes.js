import { Router } from "express";
import {
  getArchitecture,
  getDataset,
  getModel,
  getPerformance,
} from "../controllers/project.controller.js";

export const projectRouter = Router();

projectRouter.get("/model", getModel);
projectRouter.get("/dataset", getDataset);
projectRouter.get("/performance", getPerformance);
projectRouter.get("/architecture", getArchitecture);
