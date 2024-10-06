import { Schema, model } from "mongoose";

const likeSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
   storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
   },
});

export const Like = model("Like", likeSchema);
