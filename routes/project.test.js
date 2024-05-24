import request from 'supertest';
import express from 'express';
import projectRouter from '../routes/project'; // Adjust the path as necessary
import {
  createProject,
  getAllUserProjects,
  updateProject,
  getUserProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/project';
import { protect, getUserToAdd } from '../controllers/auth';

// Mock the controller functions
jest.mock('../controllers/project', () => ({
  createProject: jest.fn((req, res) => res.status(201).json({ message: 'Project created' })),
  getAllUserProjects: jest.fn((req, res) => res.status(200).json({ message: 'All user projects' })),
  updateProject: jest.fn((req, res) => res.status(200).json({ message: 'Project updated' })),
  getUserProject: jest.fn((req, res) => res.status(200).json({ message: 'User project' })),
  deleteProject: jest.fn((req, res) => res.status(204).send()),
  addMember: jest.fn((req, res) => res.status(200).json({ message: 'Member added' })),
  removeMember: jest.fn((req, res) => res.status(200).json({ message: 'Member removed' })),
}));

// Mock the middleware functions
jest.mock('../controllers/auth', () => ({
  protect: jest.fn((req, res, next) => next()),
  getUserToAdd: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/projects', projectRouter);

describe('Project Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /projects', () => {
    it('should create a project', async () => {
      const response = await request(app)
        .post('/projects')
        .set('Authorization', 'Bearer token')
        .send({ name: 'New Project' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Project created' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(createProject).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /projects', () => {
    it('should get all user projects', async () => {
      const response = await request(app)
        .get('/projects')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'All user projects' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getAllUserProjects).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /projects/:id', () => {
    it('should update a project', async () => {
      const response = await request(app)
        .patch('/projects/1')
        .set('Authorization', 'Bearer token')
        .send({ name: 'Updated Project' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Project updated' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(updateProject).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get a user project', async () => {
      const response = await request(app)
        .get('/projects/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User project' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getUserProject).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete a project', async () => {
      const response = await request(app)
        .delete('/projects/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(204);
      expect(protect).toHaveBeenCalledTimes(1);
      expect(deleteProject).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /projects/add-member', () => {
    it('should add a member', async () => {
      const response = await request(app)
        .patch('/projects/add-member')
        .set('Authorization', 'Bearer token')
        .send({ userId: '123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Member added' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getUserToAdd).toHaveBeenCalledTimes(1);
      expect(addMember).toHaveBeenCalledTimes(1);
    });
  });

  describe('PATCH /projects/remove-member', () => {
    it('should remove a member', async () => {
      const response = await request(app)
        .patch('/projects/remove-member')
        .set('Authorization', 'Bearer token')
        .send({ userId: '123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Member removed' });
      expect(protect).toHaveBeenCalledTimes(1);
      expect(getUserToAdd).toHaveBeenCalledTimes(1);
      expect(removeMember).toHaveBeenCalledTimes(1);
    });
  });
});
