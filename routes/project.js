import express from "express";
import { createProject } from "../controllers/project.js";
import { protect } from "../controllers/auth.js";

const projectRouter = express.Router();

projectRouter.route("/").post(protect, createProject);

export default projectRouter;
