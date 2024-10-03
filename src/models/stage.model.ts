import { Schema, model } from "mongoose";

const stageSchema = new Schema({
   storyId: String,
   stageNumber: Number,
   stageStory: String,
   storyContext: String,
   place: String,
   bgm: String,
   isEnd: Boolean,
});

export const Stage = model("Stage", stageSchema);
