// import request from 'supertest';
// import app from './app';
// import User from './models/user';

// // Set the environment variable to 'test'
// process.env.NODE_ENV = 'test';
// process.env.JWT_SECRET = 'testsecret';  // Set your JWT secret for testing
// console.log('Running in test environment');

// // Mock the User model
// jest.mock('./models/user');

// describe('Express App', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return 404 for unhandled routes', async () => {
//     const res = await request(app).get('/nonexistentroute');
//     console.log('Response for /nonexistentroute:', res.statusCode, res.body);
//     expect(res.statusCode).toEqual(404);
//     expect(res.body.status).toBe('fail');
//     expect(res.body.message).toMatch(/Can't find \/nonexistentroute on this server/);
//   });

//   it('should handle /users/register route', async () => {
//     User.create.mockResolvedValue({
//       _id: '12345',
//       firstName: 'Test',
//       lastName: 'User',
//       email: 'testuser@example.com',
//       password: 'hashedpassword'
//     });

//     const res = await request(app).post('/users/register').send({
//       firstName: 'Test',
//       lastName: 'User',
//       email: 'testuser@example.com',
//       password: 'testpass'
//     });
//     console.log('Response for /users/register:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//     expect(res.statusCode).toEqual(201);
//     expect(res.body.status).toBe('success');
//     expect(res.body.user).toHaveProperty('token');
//   });

//   it('should handle /users/login route', async () => {
//     User.findOne.mockImplementationOnce((query) => {
//       console.log('Mock User.findOne called with:', query);
//       return Promise.resolve({
//         _id: '12345',
//         firstName: 'Test',
//         lastName: 'User',
//         email: query.email,
//         password: 'hashedpassword',
//         correctPassword: async (inputPassword, savedPassword) => {
//           console.log('Mock correctPassword called with:', inputPassword, savedPassword);
//           const result = inputPassword === 'testpass'; // Simulate the password check
//           console.log('Mock correctPassword result:', result);
//           return result;
//         }
//       });
//     });

//     const res = await request(app).post('/users/login').send({
//       email: 'testuser@example.com',
//       password: 'testpass'
//     });
//     console.log('Response for /users/login:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.status).toBe('success');
//     expect(res.body.user).toHaveProperty('token');
//   });

//   // Other test cases for remaining routes
//   it('should handle /projects route', async () => {
//     const res = await request(app).get('/projects');
//     console.log('Response for /projects:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//   });

//   it('should handle /columns route', async () => {
//     const res = await request(app).get('/columns');
//     console.log('Response for /columns:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//   });

//   it('should handle /tasks route', async () => {
//     const res = await request(app).get('/tasks');
//     console.log('Response for /tasks:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//   });

//   it('should handle /comments route', async () => {
//     const res = await request(app).get('/comments');
//     console.log('Response for /comments:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//   });

//   it('should handle /activities route', async () => {
//     const res = await request(app).get('/activities');
//     console.log('Response for /activities:', res.statusCode, res.body);
//     expect(res.statusCode).not.toEqual(404);
//   });
// });
