import { Schema, model } from "mongoose";

const stageSchema = new Schema({
   storyId: String,
   stageNumber: Number,
   stageTitle: String,
   stageStory: String,
   storySummary: String,
   place: String,
   bgm: String,
});

export const Stage = model("Stage", stageSchema);
