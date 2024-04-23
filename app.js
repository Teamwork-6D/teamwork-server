import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Routers
import userRouter from './routes/user.js';
import projectRouter from './routes/project.js';
import columnRouter from './routes/column.js';
import taskRouter from './routes/task.js';
import commentRouter from './routes/comment.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/projects', projectRouter);
app.use('/columns', columnRouter);
app.use('/tasks', taskRouter);
app.use('/comments', commentRouter);

// Handling all unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
