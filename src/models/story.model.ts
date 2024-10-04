import { Schema, model } from "mongoose";

const storySchema = new Schema({
   userId: String,
   title: String,
   description: String,
   premise: String,
   thumbnail: String,
   isFinish: Boolean,
   maxStage: Number,
   createdAt: { type: Date, default: Date.now },
});

storySchema.virtual("likes", {
   ref: "Like",
   localField: "_id",
   foreignField: "storyId",
});

export const Story = model("Story", storySchema);
