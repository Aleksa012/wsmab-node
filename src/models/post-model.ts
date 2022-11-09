import { Schema, model } from "mongoose";

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: [500, "Content is too long"],
  },
  author: {
    type: String,
    required: true,
  },
  img: {
    type: String || null,
    default: null,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  popular: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: [],
    default: [],
  },
});

export const Post = model("Post", postSchema);
