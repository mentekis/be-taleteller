import mongoose from "mongoose";

export async function connectDb() {
   await mongoose.connect(process.env.MONGO_URI as string);
   // eslint-disable-next-line @/no-console
   console.log("Connected to MongoDB");
}
