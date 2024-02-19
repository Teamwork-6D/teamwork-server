import jwt from "jsonwebtoken";
import User from "../models/user.js";

class UserAuth {}

export async function register(req, res, next) {
  try {
    res.send("will handle regiser");
  } catch (error) {
    console.log(error);
  }
}

export async function login(req, res, next) {
  try {
    res.send("will handle login");
  } catch (error) {
    console.log(error);
  }
}
