import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { User } from "../../models/user-model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface UserResponse {
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  email: string;
  id: string;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({ message: "User created successfully" });
  } catch (error: any) {
    res.status(400).send(error);
  }
};

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const allUsers = await User.find();

    const allUsersFormated: UserResponse[] = allUsers.map(
      ({ _id, firstName, lastName, createdAt, email, username }) => {
        return {
          id: _id.toString(),
          username,
          email,
          firstName,
          lastName,
          createdAt,
        };
      }
    );

    res.status(200).send(allUsersFormated);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
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
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).send({ message: "Bad credentials" });
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsCorrect) {
      res.status(404).send({ message: "Bad credentials" });
      return;
    }

    const secret = process.env.ACCESS_TOKEN_KEY;

    if (!secret) return;

    const token = jwt.sign({ username: user.username }, secret, {
      expiresIn: "1d",
    });

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send({ message: "Bad request" });
  }
};
