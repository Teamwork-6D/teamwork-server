import request from 'supertest';
import express from 'express';
import activityRouter from '../routes/activity'; // Adjust the path as necessary
import { getAllProjectActivities } from '../controllers/activity';
import { protect } from '../controllers/auth';

// Mock the controller functions
jest.mock('../controllers/activity', () => ({
  getAllProjectActivities: jest.fn((req, res) => res.status(200).json({ activities: [] })),
}));

// Mock the middleware function
jest.mock('../controllers/auth', () => ({
  protect: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/activities', activityRouter);

describe('Activity Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /activities', () => {
    it('should get all project activities', async () => {
      const response = await request(app)
        .get('/activities')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ activities: [] });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllProjectActivities).toHaveBeenCalledTimes(1);
    });
  });
});
