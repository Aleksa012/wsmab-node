import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";

import { userRouter } from "./routes/routers/users";
import { postRouter } from "./routes/routers/posts";

const app: Application = express();

mongoose.connect(
  `mongodb+srv://${process.env.DB}@wsmacluster.lomqxvf.mongodb.net/?retryWrites=true&w=majority`
);

app.use(express.json());
app.use(
  cors({
    origin: "https://random-fs-app.vercel.app",
  })
);

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(process.env.PORT);
