import { Schema, model } from "mongoose";

const userSchema = new Schema({
   name: String,
   username: String,
   email: String,
   password: String,
});

userSchema.virtual("likes", {
   ref: "Like",
   localField: "_id",
   foreignField: "userId",
});

export const User = model("User", userSchema);
