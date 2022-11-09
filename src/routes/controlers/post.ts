import { Response, Request } from "express";
import { Post } from "../../models/post-model";
import { User } from "./../../models/user-model";

interface ErrorResponse {
  status: number;
  message: string;
}

const errorRes = (status: number, message: string): ErrorResponse => {
  return {
    status,
    message,
  };
};

interface CreatePostReqBody {
  content: string;
  author: string;
  img?: string;
}

const formatAuthor = async (id: string) => {
  const postAuthor = await User.findById(id);

  const formatedAuthor = postAuthor && {
    id: postAuthor._id.toString(),
    username: postAuthor.username,
    email: postAuthor.email,
    firstName: postAuthor.firstName,
    lastName: postAuthor.lastName,
    createdAt: postAuthor.createdAt,
  };

  return formatedAuthor;
};

const verifyAuthor = async (postId: string, tokenId: string) => {
  const post = await Post.findById(postId);

  const user = await User.findById(post?.author);

  if (user?._id.toString() !== tokenId) return false;

  return true;
};

export const createPost = async (
  req: Request<{}, {}, CreatePostReqBody>,
  res: Response
) => {
  try {
    const newPost = new Post({ ...req.body, author: req.token?.id });
    await newPost.save();
    res.status(200).send("Post created successfully");
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad Request"));
  }
};

export const getAllPosts = async (_: Request, res: Response) => {
  try {
    const allPosts = await Post.find();

    const formatedPosts = [];

    for (const {
      _id,
      author: authorId,
      createdAt,
      img,
      popular,
      likes,
      content,
    } of allPosts) {
      const formatedAuthor = (await formatAuthor(authorId)) || "author deleted";

      const formatedPost = {
        id: _id.toString(),
        content,
        author: formatedAuthor,
        createdAt,
        img,
        popular,
        likes,
      };

      formatedPosts.push(formatedPost);
    }

    res.status(200).send({ posts: formatedPosts, count: formatedPosts.length });
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad Request"));
  }
};

export const getPostById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).send(errorRes(404, "Post not found"));

    const formatedAuthor =
      (await formatAuthor(post.author)) || "author deleted";

    const formatedPost = {
      id: post._id.toString(),
      content: post.content,
      author: formatedAuthor,
      createdAt: post.createdAt,
      img: post.img,
      popular: post.popular,
      likes: post.likes,
    };

    res.status(200).send(formatedPost);
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad Request"));
  }
};

export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const { token } = req;
  try {
    const verified = token && (await verifyAuthor(id, token.id));

    if (!verified)
      return res.status(403).send(errorRes(403, "Can't delete this post"));

    await Post.findByIdAndDelete(id);

    res.status(200).send("Post successfully deleted");
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad Request"));
  }
};

export const editPost = async (
  req: Request<
    { id: string },
    {},
    {
      content?: string;
      img?: string;
    }
  >,
  res: Response
) => {
  const { id } = req.params;
  const { token } = req;
  const { content, img } = req.body;
  try {
    const verified = token && (await verifyAuthor(id, token.id));

    if (!verified)
      return res.status(403).send(errorRes(403, "Can't edit this post"));

    await Post.findByIdAndUpdate(id, {
      content,
      img,
    });

    res.status(200).send("Post successfully edited");
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad Request"));
  }
};

export const likePost = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { token } = req;
  try {
    const post = await Post.findById(id);

    if (!post || !token)
      return res.status(500).send(errorRes(500, "Something went wrong"));

    const newLikes: string[] = post?.likes.includes(token.id)
      ? post.likes.filter((like) => like !== token.id)
      : [...post.likes, token.id];

    await Post.findByIdAndUpdate(id, {
      likes: newLikes,
      popular: newLikes.length > 4 ? true : false,
    });

    res.send(200);
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad Request"));
  }
};
