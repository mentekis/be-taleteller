import { Schema, model } from "mongoose";

const authSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
   refreshToken: String,
});

export const Auth = model("Auth", authSchema);
