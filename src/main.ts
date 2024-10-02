import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "./utils/connectDb";

const app = express();

connectDb();

app.listen(process.env.PORT, () => {
   // eslint-disable-next-line @/no-console
   console.log(`Server running on port ${process.env.PORT}`);
});
