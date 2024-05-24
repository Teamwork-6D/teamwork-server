import express from 'express';
import { getAllProjectTasks, addUserToTask, removeUserFromTask, getTask } from '../controllers/task.js';
import { protect } from '../controllers/auth.js';

const taskRouter = express.Router();

taskRouter.route('/add-user').patch(addUserToTask);
taskRouter.route('/remove-user').patch(removeUserFromTask);

taskRouter
  .route('/')
  .get(protect, getAllProjectTasks);

taskRouter.route('/:id').get(protect, getTask);

export default taskRouter;
