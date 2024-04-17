import express from 'express';
import {
  createProject,
  getAllUserProjects,
  updateProject,
  getUserProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/project.js';
import { protect, getUserToAdd } from '../controllers/auth.js';

const projectRouter = express.Router();

projectRouter.route('/add-member').patch(protect, getUserToAdd, addMember);
projectRouter
  .route('/remove-member')
  .patch(protect, getUserToAdd, removeMember);

projectRouter
  .route('/')
  .post(protect, createProject)
  .get(protect, getAllUserProjects);

projectRouter
  .route('/:id')
  .patch(protect, updateProject)
  .get(protect, getUserProject)
  .delete(protect, deleteProject);

export default projectRouter;
