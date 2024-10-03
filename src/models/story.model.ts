import { Schema, model } from "mongoose";

const storySchema = new Schema({
   title: String,
   description: String,
   premise: String,
   thumbnail: String,
   isFinish: Boolean,
});

export const Story = model("Story", storySchema);
