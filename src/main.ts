import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { deleteImgS3, generateStage, uploadImgS3 } from "./services/stage.service";
import { getRandomPremise, validatePremise, completeStoryMetadata } from "./services/story.service";

import { connectDb } from "./utils/connectDb";
import { storyRouter } from "./routes/story.route";
import { stageRouter } from "./routes/stage.route";

const app = express();

app.use(express.json());

app.use(storyRouter);
app.use(stageRouter);

// testing purpose only--------
app.post("/tests3", async (req, res) => {
   const result = await uploadImgS3(req.body.imgUrl, req.body.key);
   res.json(result);
});

app.post("/deletes3/:key", async (req, res) => {
   const result = await deleteImgS3(req.params.key);
   res.json(result);
});

app.get("/test/:storyId", async (req, res) => {
   const result = await completeStoryMetadata(req.params.storyId);
   res.json(result);
});

app.post("/generatestage", async (req, res) => {
   const stage = await generateStage(req.body);
   res.json(stage);
});

app.get("/randompremise", async (_, res) => {
   const premise = await getRandomPremise();
   res.json(premise);
});

app.post("/validatepremise", async (req, res) => {
   const userPremise = req.body.premise;
   const result = await validatePremise(userPremise);
   res.json(result);
});

// --------------------------

connectDb();

app.listen(process.env.PORT, () => {
   // eslint-disable-next-line @/no-console
   console.log(`Server running on port ${process.env.PORT}`);
});
