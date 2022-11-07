import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token) {
    const secret = process.env.ACCESS_TOKEN_KEY;
    if (!secret) return res.status(500);

    jwt.verify(token, secret, (error) => {
      if (error) return res.status(403).send({ message: error.message });
      next();
    });
  } else {
    return res.status(403).send({ message: "Missing authorization" });
  }
};
