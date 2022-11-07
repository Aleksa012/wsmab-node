import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";

import { userRouter } from "./routes/user-routes";

const app: Application = express();

mongoose.connect(
  `mongodb+srv://${process.env.DB}@wsmacluster.lomqxvf.mongodb.net/?retryWrites=true&w=majority`
);

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

app.listen(process.env.PORT);