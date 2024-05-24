import request from 'supertest';
import app from './app.js';

describe('App', () => {
  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'fail',
      message: "Can't find /unknown-route on this server",
    });
  });

  it('should respond with 404 for unknown routes on POST requests', async () => {
    const response = await request(app).post('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'fail',
      message: "Can't find /unknown-route on this server",
    });
  });

  it('should respond with 404 for unknown routes on PUT requests', async () => {
    const response = await request(app).put('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'fail',
      message: "Can't find /unknown-route on this server",
    });
  });

  it('should respond with 404 for unknown routes on DELETE requests', async () => {
    const response = await request(app).delete('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'fail',
      message: "Can't find /unknown-route on this server",
    });
  });

  // Add more test cases as needed
});
