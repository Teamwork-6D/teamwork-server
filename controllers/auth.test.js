// auth.test.js

import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { register, login, protect, getUserToAdd } from './auth.js';
import util from 'util';

jest.mock('jsonwebtoken');
jest.mock('../models/user.js');
jest.mock('util');

describe('Auth Service Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const req = {
        body: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const newUser = { _id: 'user123', ...req.body };
      User.create.mockResolvedValue(newUser);
      jwt.sign.mockReturnValue('token123');

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'user123' }, process.env.JWT_SECRET);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        user: {
          id: 'user123',
          token: 'token123',
          fullName: 'John Doe',
          email: 'john.doe@example.com'
        }
      });
    });

    it('should handle errors during registration', async () => {
      const req = {
        body: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      User.create.mockRejectedValue(new Error('Error creating user account.'));

      await register(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Error creating user account.',
        stack: expect.anything()
      });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const req = {
        body: { email: 'john.doe@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const user = {
        _id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        correctPassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(user);
      jwt.sign.mockReturnValue('token123');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(user.correctPassword).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'user123' }, process.env.JWT_SECRET);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        user: {
          id: 'user123',
          token: 'token123',
          fullName: 'John Doe',
          email: 'john.doe@example.com'
        }
      });
    });

    it('should handle missing email or password', async () => {
      const req = {
        body: { email: '', password: '' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Please provide email and password'
      });
    });

    it('should handle incorrect email or password', async () => {
      const req = {
        body: { email: 'john.doe@example.com', password: 'wrongpassword' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const user = {
        _id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        correctPassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(user);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(user.correctPassword).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Incorrect email or password.'
      });
    });

    it('should handle errors during login', async () => {
      const req = {
        body: { email: 'john.doe@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      User.findOne.mockRejectedValue(new Error('Error logging into user account.'));

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Error logging into user account.',
        stack: expect.anything()
      });
    });
  });

  describe('protect', () => {
    it('should protect a route successfully', async () => {
      const req = {
        headers: {
          authorization: 'Bearer token123'
        }
      };
      const res = {};
      const next = jest.fn();
      const decodedPayLoad = { id: 'user123' };
      jwt.verify.mockImplementation((token, secret, callback) => callback(null, decodedPayLoad));
      util.promisify.mockReturnValue(() => Promise.resolve(decodedPayLoad));
      const user = { _id: 'user123' };
      User.findById.mockResolvedValue(user);

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('token123', process.env.JWT_SECRET, expect.any(Function));
      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('should handle missing token', async () => {
      const req = {
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'You are not signed in! Please sign in to get access.'
      });
    });

    it('should handle invalid token', async () => {
      const req = {
        headers: {
          authorization: 'Bearer invalidtoken'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Invalid token'), null));
      util.promisify.mockReturnValue(() => Promise.reject(new Error('Invalid token')));

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('invalidtoken', process.env.JWT_SECRET, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'The user no longer exists.'
      });
    });
  });

  describe('getUserToAdd', () => {
    it('should find a user to add successfully', async () => {
      const req = {
        body: { userEmail: 'john.doe@example.com' }
      };
      const res = {};
      const next = jest.fn();
      const user = { email: 'john.doe@example.com', _id: 'user123' };
      User.findOne.mockResolvedValue(user);

      await getUserToAdd(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(req.userToAdd).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      const req = {
        body: { userEmail: 'john.doe@example.com' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      User.findOne.mockResolvedValue(null);

      await getUserToAdd(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User to add not found'
      });
    });

    it('should handle errors in getUserToAdd', async () => {
      const req = {
        body: { userEmail: 'john.doe@example.com' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      User.findOne.mockRejectedValue(new Error('Database error'));

      await getUserToAdd(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User to add not found'
      });
    });
  });
});
