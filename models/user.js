import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "User must have a first name"],
    },
    lastName: {
      type: String,
      required: [true, "User must have a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "User must provide an email"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
