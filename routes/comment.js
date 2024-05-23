import express from 'express';
import { createComment, deleteComment, getAllTaskComments } from '../controllers/comment.js';
import { protect } from '../controllers/auth.js';

const commentRouter = express.Router();


commentRouter
  .route('/')
  .post(protect, createComment)
  .get(protect, getAllTaskComments);

commentRouter
  .route('/:id')
  .delete(protect, deleteComment);

export default commentRouter;
