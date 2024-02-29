import express from "express";
import {
  createProject,
  getAllUserProjects,
  updateProject,
  getUserProject,
  deleteProject,
} from "../controllers/project.js";
import { protect } from "../controllers/auth.js";

const projectRouter = express.Router();

projectRouter
  .route("/")
  .post(protect, createProject)
  .get(protect, getAllUserProjects);

projectRouter
  .route("/:id")
  .patch(protect, updateProject)
  .get(protect, getUserProject)
  .delete(protect, deleteProject);

export default projectRouter;
