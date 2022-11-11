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

interface CreateUserReqBody {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export const createUser = async (
  req: Request<{}, {}, CreateUserReqBody>,
  res: Response
) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send("User created successfully");
  } catch (error: any) {
    res.status(400).send(errorRes(400, "Bad request"));
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
    res.status(400).send(errorRes(400, "Bad request"));
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
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
    res.status(400).send(errorRes(400, "Bad request"));
  }
};

interface LoginReqBody {
  username: string;
  password: string;
}

export const login = async (
  req: Request<{}, {}, LoginReqBody>,
  res: Response
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).send("Bad credentials");
      return;
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      res.status(404).send("Bad credentials");
      return;
    }

    const secret = process.env.ACCESS_TOKEN_KEY;

    if (!secret) return;

    const token = jwt.sign({ id: user._id, username: user.username }, secret, {
      expiresIn: "1d",
    });

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad request"));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).send(errorRes(404, "User not found"));
    res.status(200).send("User successfully deleted");
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad request"));
  }
};

interface ChangeUsernameReqBody {
  username: string;
  newUsername: string;
}

export const changeUsername = async (
  req: Request<{}, {}, ChangeUsernameReqBody>,
  res: Response
) => {
  const { username, newUsername } = req.body;
  try {
    const nameAlreadyExists = !!(await User.findOne({
      username: newUsername,
    }));
    if (nameAlreadyExists)
      return res
        .status(400)
        .send(errorRes(400, "That username is already in use"));

    await User.findOneAndUpdate(
      { username },
      {
        username: newUsername,
      }
    );

    res.status(200).send("Username successfully edited");
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad request"));
  }
};

interface ChangePassReqBody {
  newPassword: string;
  oldPassword: string;
}

export const changePassword = async (
  req: Request<{ id: string }, {}, ChangePassReqBody>,
  res: Response
) => {
  const { newPassword, oldPassword } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).send(errorRes(404, "User not found"));
    const correctPassword = !!(await bcrypt.compare(
      oldPassword,
      user.password
    ));

    if (!correctPassword)
      return res
        .status(400)
        .send(errorRes(400, "Please enter the valid password"));

    if (newPassword.length < 8 || newPassword.length > 16)
      return res
        .status(400)
        .send(errorRes(400, "New password doesn't follow the requirements"));

    const passwordToSet = await bcrypt.hash(
      req.body.newPassword,
      await bcrypt.genSalt(10)
    );

    await User.findByIdAndUpdate(id, {
      password: passwordToSet,
    });
    res.status(200).send("Password successfully edited");
  } catch (error) {
    res.status(400).send(errorRes(400, "Bad request"));
  }
};
