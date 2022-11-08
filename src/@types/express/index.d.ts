import { Token } from "./../../auth/auth";

declare global {
  namespace Express {
    interface Request {
      token?: Token;
    }
  }
}
