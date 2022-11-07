import { Router, Request, Response } from "express";
import { User } from "../models/user-model";

interface UserResponse {
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  email: string;
  id: string;
}

export const userRouter: Router = Router();

userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({ message: "User created successfully" });
  } catch (error: any) {
    res.status(400).send(error);
  }
});

userRouter.get("/", async (_, res: Response) => {
  try {
    const allUsers = await User.find();

    const allUsersFormated: UserResponse[] = [];

    for (const user of allUsers) {
      allUsersFormated.push({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      });
    }

    res.status(200).send(allUsersFormated);
  } catch (error: any) {
    res.status(400).send(error);
  }
});

userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return;

    const formatedUser: UserResponse = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };

    res.status(200).send(formatedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});
