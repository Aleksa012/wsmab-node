import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: [12, "Username is too long"],
  },
  firstName: {
    type: String,
    required: true,
    maxlength: [12, "First name is too long"],
  },
  lastName: {
    type: String,
    required: true,
    maxlength: [12, "Last name is too long"],
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password is too short"],
    maxlength: [16, "Password is too long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Email is not valid"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model("User", userSchema);
