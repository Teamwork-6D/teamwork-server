import express from 'express';
import { getAllProjectColumns } from '../controllers/column.js';
import { protect } from '../controllers/auth.js';

const columnRouter = express.Router();


columnRouter
  .route('/')
  .get(protect, getAllProjectColumns);

export default columnRouter;
