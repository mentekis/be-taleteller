import { Schema, model } from "mongoose";

const stageSchema = new Schema({
   storyId: { type: Schema.Types.ObjectId, ref: "Story" },
   stageNumber: Number,
   stageStory: String,
   place: String,
   bgm: String,
   optionA:String,
   optionB:String,
   isEnd: Boolean,
   optionA: String,
   optionB: String,
});

export const Stage = model("Stage", stageSchema);
