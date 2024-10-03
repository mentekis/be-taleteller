import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { generateStage } from "./services/stage.service";

import { connectDb } from "./utils/connectDb";

const app = express();

app.use(express.json());

app.post("/generatestage", async (req, res) => {
   const stage = await generateStage(req.body);
   res.json(stage);
});

connectDb();

app.listen(process.env.PORT, () => {
   // eslint-disable-next-line @/no-console
   console.log(`Server running on port ${process.env.PORT}`);
});
