import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  login,
  changeUsername,
  changePassword,
} from "./../controlers/users";
import { auth } from "../../auth/auth";

export const userRouter: Router = Router();

userRouter.get("/", auth, getAllUsers);
userRouter.get("/:id", auth, getUserById);
userRouter.post("/", createUser);
userRouter.post("/auth/login", login);
userRouter.post("/update", auth, changeUsername);
userRouter.post("/reset-password/:id", auth, changePassword);
userRouter.delete("/delete/:id", auth, deleteUser);
