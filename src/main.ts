import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import { deleteImgS3, generateStage, uploadImgS3 } from "./services/stage.service";
import { getRandomPremise, validatePremise, completeStoryMetadata } from "./services/story.service";
import * as userService from "./services/user.service";

import { connectDb } from "./utils/connectDb";
import { storyRouter } from "./routes/story.route";
import { stageRouter } from "./routes/stage.route";
import { authRouter } from "./routes/auth.route";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);

app.use(authMiddleware)

app.use(storyRouter);
app.use(stageRouter);

// testing purpose only--------
app.get("/protected", authMiddleware, (req, res) => {
   res.send("protected");
});

app.get("/cookies", (req, res) => {
   res.json(req.cookies);
});

app.get("/users", async (req, res) => {
   const users = await userService.getUsers();
   res.cookie("test", "test").json(users);
});

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
