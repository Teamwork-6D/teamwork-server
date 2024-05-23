// Set the environment variable to 'test'
process.env.NODE_ENV = 'test';
console.log('Running in test environment');

// Import the app after setting the environment variable
import request from 'supertest';
import app from './app';
import User from './models/user';

// Mock the User model
jest.mock('./models/user');

describe('Express App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 for unhandled routes', async () => {
    const res = await request(app).get('/nonexistentroute');
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toMatch(/Can't find \/nonexistentroute on this server/);
  });

  it('should handle /users/register route', async () => {
    User.create.mockResolvedValue({
      _id: '12345',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'testpass'
    });

    const res = await request(app).post('/users/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'testpass'
    });
    console.log('Response for /users/register:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
    // Expecting a 201 status on successful registration
    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe('success');
    expect(res.body.user).toHaveProperty('token');
  });

  it('should handle /users/login route', async () => {
    User.findOne.mockResolvedValue({
      _id: '12345',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'testpass',
      correctPassword: async (inputPassword, savedPassword) => inputPassword === savedPassword,
    });

    const res = await request(app).post('/users/login').send({
      email: 'testuser@example.com',
      password: 'testpass'
    });
    console.log('Response for /users/login:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
    // Expecting a 200 status on successful login
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.user).toHaveProperty('token');
  });

  // Other test cases for remaining routes
  it('should handle /projects route', async () => {
    const res = await request(app).get('/projects');
    console.log('Response for /projects:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
  });

  it('should handle /columns route', async () => {
    const res = await request(app).get('/columns');
    console.log('Response for /columns:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
  });

  it('should handle /tasks route', async () => {
    const res = await request(app).get('/tasks');
    console.log('Response for /tasks:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
  });

  it('should handle /comments route', async () => {
    const res = await request(app).get('/comments');
    console.log('Response for /comments:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
  });

  it('should handle /activities route', async () => {
    const res = await request(app).get('/activities');
    console.log('Response for /activities:', res.statusCode, res.body);
    expect(res.statusCode).not.toEqual(404);
  });
});
