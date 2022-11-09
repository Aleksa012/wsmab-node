import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  login,
} from "./../controlers/users";
import { auth } from "../../auth/auth";

export const userRouter: Router = Router();

userRouter.get("/", auth, getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.post("/auth/login", login);
