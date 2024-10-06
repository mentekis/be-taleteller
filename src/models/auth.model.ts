import { Schema, model } from "mongoose";

const authSchema = new Schema({
   userId: String,
   token: String,
});

export const Auth = model("Auth", authSchema);
