import request from 'supertest';
import express from 'express';
import taskRouter from '../routes/task'; // Adjust the path as necessary
import { getAllProjectTasks } from '../controllers/task';
import { protect } from '../controllers/auth';

// Mock the controller functions
jest.mock('../controllers/task', () => ({
  getAllProjectTasks: jest.fn((req, res) => {
    res.status(200).json({ message: 'All project tasks' });
  }),
}));

// Mock the middleware function
jest.mock('../controllers/auth', () => ({
  protect: jest.fn((req, res, next) => {
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

describe('Task Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should get all project tasks', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer token'); // Assuming you have some kind of token-based auth

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'All project tasks' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllProjectTasks).toHaveBeenCalledTimes(1);
    });

    it('should call protect middleware before getting tasks', async () => {
      await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer token'); // Assuming you have some kind of token-based auth

      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllProjectTasks).toHaveBeenCalledTimes(1);
    });
  });
});
