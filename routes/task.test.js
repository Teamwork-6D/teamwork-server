import request from 'supertest';
import express from 'express';
import taskRouter from '../routes/task'; 
import { getAllProjectTasks, addUserToTask, removeUserFromTask } from '../controllers/task';
import { protect } from '../controllers/auth';

jest.mock('../controllers/task', () => ({
  getAllProjectTasks: jest.fn((req, res) => {
    res.status(200).json({ message: 'All project tasks' });
  }),
  addUserToTask: jest.fn((req, res) => {
    res.status(200).json({ message: 'User added to task' });
  }),
  removeUserFromTask: jest.fn((req, res) => {
    res.status(200).json({ message: 'User removed from task' });
  }),
}));

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
        .set('Authorization', 'Bearer token'); 

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'All project tasks' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllProjectTasks).toHaveBeenCalledTimes(1);
    });

    it('should call protect middleware before getting tasks', async () => {
      await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer token'); 

      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllProjectTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /tasks/add-user', () => {
    it('should add user to task', async () => {
      const response = await request(app)
        .patch('/tasks/add-user')
        .set('Authorization', 'Bearer token') 
        .send({ userId: 'user123', taskId: 'task123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User added to task' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(addUserToTask).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /tasks/remove-user', () => {
    it('should remove user from task', async () => {
      const response = await request(app)
        .patch('/tasks/remove-user')
        .set('Authorization', 'Bearer token') 
        .send({ userId: 'user123', taskId: 'task123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User removed from task' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(removeUserFromTask).toHaveBeenCalledTimes(1);
    });
  });
});
