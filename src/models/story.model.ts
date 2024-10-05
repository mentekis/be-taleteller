import { Schema, model } from "mongoose";

const storySchema = new Schema({
   userId: { type: Schema.Types.ObjectId, ref: "User" },
   title: String,
   description: String,
   premise: String,
   thumbnail: String,
   isFinish: Boolean,
   maxStage: Number,
   context: String,
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

storySchema.virtual("likes", {
   ref: "Like",
   localField: "_id",
   foreignField: "storyId",
});

export const Story = model("Story", storySchema);
