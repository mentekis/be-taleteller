import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import { connectDb } from "./utils/connectDb";
import { storyRouter } from "./routes/story.route";
import { stageRouter } from "./routes/stage.route";
import { authRouter } from "./routes/auth.route";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "*",
   }),
);

app.use(authRouter);

app.use(authMiddleware);

app.use(storyRouter);
app.use(stageRouter);

connectDb();

app.listen(process.env.PORT, () => {
   // eslint-disable-next-line @/no-console
   console.log(`Server running on port ${process.env.PORT}`);
});
