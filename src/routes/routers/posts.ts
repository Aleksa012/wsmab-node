import { Router } from "express";
import { auth } from "../../auth/auth";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  editPost,
  likePost,
} from "./../controlers/post";

export const postRouter: Router = Router();

postRouter.get("/", auth, getAllPosts);
postRouter.get("/:id", auth, getPostById);
postRouter.get("/author/self", auth, getPostsByAuthor);
postRouter.post("/", auth, createPost);
postRouter.post("/edit/:id", auth, editPost);
postRouter.post("/like/:id", auth, likePost);
postRouter.delete("/delete/:id", auth, deletePost);
