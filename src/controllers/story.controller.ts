import { Request, Response } from "express";
import * as storyService from "../services/story.service";
import { IStory } from "../types/story";

export async function handleCreateStory(req: Request, res: Response) {
   try {
      const { premise } = req.body;
      const { userId } = res.locals;
      const newStory = await storyService.createNewStory({ userId, premise });
      res.status(201).json({
         message: "new story created",
         data: newStory,
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "story creation failed",
            data: { ...error },
         });
      }
   }
}

export async function handleGetStories(req: Request, res: Response) {
   const { start, limit, search, userId, orderBy, isFinish } = req.query;

   const startIndex = Number(start) || 0;
   const limitIndex = Number(limit) || 100;

   const filter: Partial<IStory> = {};

   if (search) {
      filter.title = new RegExp(search as string, "i");
   }

   if (userId) {
      filter.userId = userId as string;
   }

   if (isFinish) {
      filter.isFinish = isFinish as unknown as boolean;
   }

   const { stories, total } = await storyService.get(filter, startIndex, limitIndex, orderBy as string);
   res.status(200).json({
      message: "the list of stories",
      data: stories,
      meta: {
         limit: limitIndex,
         total,
      },
   });
}

export async function handleGetSingleStory(req: Request, res: Response) {
   try {
      const { stories } = await storyService.get({ _id: req.params.storyId });

      if (stories.length === 0) throw new Error();

      res.status(200).json({
         message: "story found",
         data: stories[0],
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(404).json({
            message: "story not found",
            data: { ...error },
         });
      }
   }
}

export async function handleGetLikedStories(req: Request, res: Response) {
   try {
      const { start, limit } = req.query;
      const userId = req.params.userId;

      const startIndex = Number(start) || 0;
      const limitIndex = Number(limit) || 100;

      const { likedStories, totalLikedStories } = await storyService.getLikedStories(userId, startIndex, limitIndex);
      res.status(200).json({
         message: "list of liked stories",
         data: likedStories,
         meta: {
            limit: limitIndex,
            total: totalLikedStories,
         },
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "get liked stories failed",
            data: { ...error },
         });
      }
   }
}
export async function handleUpdateStory(req: Request, res: Response) {
   try {
      const { storyId } = req.params;
      const { title, description } = req.body;

      const updatedData: { title?: string; description?: string } = {};

      if (title) updatedData["title"] = title;
      if (description) updatedData["description"] = description;

      const updatedStory = await storyService.update(storyId, updatedData);

      res.status(201).json({
         message: "story updated",
         data: updatedStory,
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "story update failed",
            data: { ...error },
         });
      }
   }
}
export async function handleDeleteStory(req: Request, res: Response) {
   try {
      const deletedStory = await storyService.deleteStoryAndStages(req.params.storyId);
      res.status(200).json({
         message: "story deleted",
         deletedStory,
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "story deletion failed",
            data: { ...error },
         });
      }
   }
}

export async function handleGetRandomPremise(req: Request, res: Response) {
   try {
      const premise = await storyService.getRandomPremise();
      res.status(200).json({ premise });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "premise generation failed",
            data: { ...error },
         });
      }
   }
}

export async function handleValidatePremise(req: Request, res: Response) {
   try {
      const { isValid, suggestedPremise } = await storyService.validatePremise(req.body.premise);

      res.status(200).json({ isValid, suggestedPremise });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "premise validation failed",
            data: { ...error },
         });
      }
   }
}
