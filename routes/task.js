import express from 'express';
import { getAllProjectTasks } from '../controllers/task.js';
import { protect } from '../controllers/auth.js';

const taskRouter = express.Router();


taskRouter
  .route('/')
  .get(protect, getAllProjectTasks);

export default taskRouter;
