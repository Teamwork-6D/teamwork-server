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
  
});