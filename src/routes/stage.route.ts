import { Router } from "express";
import * as stageController from "../controllers/stage.controller";

export const stageRouter = Router();

// get stages by storyId
stageRouter.get("/api/v1/stages/:storyId", stageController.handleGetStagesByStoryId);

// create a new stage
stageRouter.post("/api/v1/stages", stageController.handleCreateStage);
