import express from 'express';
import { getAllProjectActivities } from '../controllers/activity.js';
import { protect } from '../controllers/auth.js';

const activityRouter = express.Router();


activityRouter
  .route('/')
  .get(protect, getAllProjectActivities);

export default activityRouter;
