import { Request, Response } from "express";
import * as stageService from "../services/stage.service";

export async function handleCreateStage(req: Request, res: Response) {
   try {
      const newStage = await stageService.create(req.body);
      res.status(201).json({
         message: "stage created",
         data: newStage,
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "stage creation failed",
            data: { ...error },
         });
      }
   }
}

export async function handleGetStagesByStoryId(req: Request, res: Response) {
   try {
      const { storyId } = req.params;
      const stages = await stageService.getByStoryId(storyId);
      res.status(200).json({
         message: `stages of storyId: ${storyId} `,
         data: stages,
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "get stages failed",
            data: { ...error },
         });
      }
   }
}
