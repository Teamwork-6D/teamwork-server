import request from 'supertest';
import express from 'express';
import columnRouter from '../routes/column'; // Adjust the path as necessary
import { getAllProjectColumns } from '../controllers/column';
import { protect } from '../controllers/auth';

// Mock the controller functions
jest.mock('../controllers/column', () => ({
  getAllProjectColumns: jest.fn((req, res) => res.status(200).json({ columns: [] })),
}));

// Mock the middleware function
jest.mock('../controllers/auth', () => ({
  protect: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/columns', columnRouter);

describe('Column Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /columns', () => {
    it('should get all project columns', async () => {
      const response = await request(app)
        .get('/columns')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ columns: [] });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllProjectColumns).toHaveBeenCalledTimes(1);
    });
  });
});
