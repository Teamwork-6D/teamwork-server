import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Routers
import userRouter from './routes/user.js';
import projectRouter from './routes/project.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/projects', projectRouter);

// Handling all unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

export default app;
