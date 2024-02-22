import jwt from "jsonwebtoken";
import User from "../models/user.js";
import AppError from "../utils/appError.js";

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET);
};

export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const newUser = await User.create({ firstName, lastName, email, password });
    const user = {
      id: newUser._id,
      token: signToken(newUser._id),
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
    };

    res.status(201).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "error",
      message: "Error creating user account.",
    });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password.", 401));
    }

    const _user = {
      id: user._id,
      token: signToken(user._id),
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };

    res.status(201).json({
      status: "success",
      user: _user,
    });
  } catch (error) {
    console.log(error);
  }
}
