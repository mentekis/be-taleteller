import { Schema, model } from "mongoose";

const stageSchema = new Schema({
   storyId: { type: Schema.Types.ObjectId, ref: "Story" },
   stageNumber: Number,
   stageStory: String,
   place: String,
   bgm: String,
   optionA: String,
   optionB: String,
   isEnd: Boolean,
});

export const Stage = model("Stage", stageSchema);
