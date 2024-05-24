import request from 'supertest';
import express from 'express';
import commentRouter from '../routes/comment'; 
import { createComment, deleteComment, getAllTaskComments } from '../controllers/comment';
import { protect } from '../controllers/auth';

jest.mock('../controllers/comment', () => ({
  createComment: jest.fn((req, res) => res.status(201).json({ message: 'Comment created' })),
  deleteComment: jest.fn((req, res) => res.status(204).send()),
  getAllTaskComments: jest.fn((req, res) => res.status(200).json({ comments: [] })),
}));

jest.mock('../controllers/auth', () => ({
  protect: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/comments', commentRouter);

describe('Comment Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /comments', () => {
    it('should create a comment', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', 'Bearer token')
        .send({ text: 'New comment' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Comment created' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(createComment).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /comments', () => {
    it('should get all task comments', async () => {
      const response = await request(app)
        .get('/comments')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ comments: [] });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllTaskComments).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should delete a comment', async () => {
      const response = await request(app)
        .delete('/comments/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(204);
      expect(protect).toHaveBeenCalledTimes(1);
      expect(deleteComment).toHaveBeenCalledTimes(1);
    });
  });
});
