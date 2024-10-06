import { Router } from "express";
import * as storyController from "../controllers/story.controller";

export const storyRouter = Router();

// get list of stories based on req.query filter
storyRouter.get("/api/v1/stories", storyController.handleGetStories);

// get random premise
storyRouter.get("/api/v1/stories/premise", storyController.handleGetRandomPremise);

// get a single story
storyRouter.get("/api/v1/stories/:storyId", storyController.handleGetSingleStory);

// get stories like by a user
storyRouter.get("/api/v1/stories/likes/:userId", storyController.handleGetLikedStories);

// create new story
storyRouter.post("/api/v1/stories", storyController.handleCreateStory);

// update story
storyRouter.patch("/api/v1/stories/:storyId", storyController.handleUpdateStory);

// delete story
storyRouter.delete("/api/v1/stories/:storyId", storyController.handleDeleteStory);


// validate user premise
storyRouter.post("/api/v1/stories/premise", storyController.handleValidatePremise);
