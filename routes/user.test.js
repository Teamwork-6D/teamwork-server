import request from 'supertest';
import express from 'express';
import userRouter from '../routes/user';
import { register, login } from '../controllers/auth';

// Mock the controller functions
jest.mock('../controllers/auth', () => ({
  register: jest.fn((req, res) => {
    res.status(201).send('User registered');
  }),
  login: jest.fn((req, res) => {
    res.status(200).send('User logged in');
  }),
}));

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/users', userRouter); // Mount the router

describe('User Router', () => {
  describe('POST /users/register', () => {
    it('should register a user', async () => {
      const response = await request(app)
        .post('/users/register')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(201);
      expect(response.text).toBe('User registered');
      expect(register).toHaveBeenCalledTimes(1);
      expect(register.mock.calls[0][0].body).toEqual({ username: 'testuser', password: 'password' });
    });
  });

  describe('POST /users/login', () => {
    it('should login a user', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.text).toBe('User logged in');
      expect(login).toHaveBeenCalledTimes(1);
      expect(login.mock.calls[0][0].body).toEqual({ username: 'testuser', password: 'password' });
    });
  });
});
