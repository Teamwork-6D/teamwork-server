import express from 'express';
import { createCommnent, deleteCommnent, getAllTaskComments } from '../controllers/comment.js';
import { protect } from '../controllers/auth.js';

const commentRouter = express.Router();


commentRouter
  .route('/')
  .post(protect, createCommnent)
  .get(protect, getAllTaskComments);

commentRouter
  .route('/:id')
  .delete(protect, deleteCommnent);

export default commentRouter;
