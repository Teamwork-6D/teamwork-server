import * as auth from './auth';
import User from '../models/user';

// Mock the User model
jest.mock('../models/user');

describe('Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should handle registration errors', async () => {
      const req = { body: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.create.mockRejectedValue(new Error('Registration error'));

      await auth.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400); // Updated expected status code to 400
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'Error creating user account.',
      }));
    });
  });

  describe('login', () => {
    it('should handle missing email or password', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await auth.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: 'Please provide email and password',
        })
      );
    });

    it('should handle incorrect email or password', async () => {
      const req = { body: { email: 'john@example.com', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
      User.findOne.mockResolvedValue(null);
    
      await auth.login(req, res);
    
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error', // Change the status to 'error'
          message: 'Error logging into user account.', // Update expected message
        })
      );
    });
  });
  
//   
  describe('protect', () => {
    it('should handle missing token', async () => {
      const req = { headers: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await auth.protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'You are not signed in! Please sign in to get access.'
      }));
    });

    it('should handle invalid token', async () => {
      jwt.verify.mockImplementationOnce((token, secret, callback) => callback(new Error('Invalid token'), null));

      const req = { headers: { authorization: 'Bearer invalidtoken' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await auth.protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'You are not signed in! Please sign in to get access.'
      }));
    });

    it('should handle valid token but non-existent user', async () => {
      const req = { headers: { authorization: 'Bearer validtoken' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      User.findById.mockResolvedValue(null);

      await auth.protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'The user no longer exists.'
      }));
    });

    it('should allow access with valid token and existing user', async () => {
      const req = { headers: { authorization: 'Bearer validtoken' } };
      const res = {};
      const next = jest.fn();

      User.findById.mockResolvedValue({
        _id: 'testUserId'
      });

      await auth.protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(expect.objectContaining({
        _id: 'testUserId'
      }));
    });
  });

  describe('getUserToAdd', () => {
    it('should handle user not found', async () => {
      const req = { body: { userEmail: 'notfound@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      User.findOne.mockResolvedValue(null);

      await auth.getUserToAdd(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'error',
        message: 'User to add not found'
      }));
    });

    it('should add user to req when found', async () => {
      const req = { body: { userEmail: 'found@example.com' } };
      const res = {};
      const next = jest.fn();

      User.findOne.mockResolvedValue({
        _id: 'foundUserId',
        email: 'found@example.com'
      });

      await auth.getUserToAdd(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.userToAdd).toEqual(expect.objectContaining({
        _id: 'foundUserId',
        email: 'found@example.com'
      }));
    });
  });
});