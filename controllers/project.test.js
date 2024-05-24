// project.test.js

import { createProject, updateProject, deleteProject, getAllUserProjects, getUserProject, addMember, removeMember } from './project.js';
import Project from '../models/project.js';

jest.mock('../models/project.js');

describe('Project Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: 'userId123' },
      userToAdd: { _id: 'memberId123' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      req.body.title = 'New Project';
      const newProject = { _id: 'projectId123', title: 'New Project', owner: req.user._id };
      Project.create.mockResolvedValue(newProject);

      await createProject(req, res, next);

      expect(Project.create).toHaveBeenCalledWith({ title: 'New Project', owner: req.user._id });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', project: newProject });
    });

    it('should handle errors', async () => {
      Project.create.mockRejectedValue(new Error('Unable to create project'));

      await createProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unable to create project' });
    });
  });

  describe('updateProject', () => {
    it('should update a project', async () => {
      req.params.id = 'projectId123';
      req.body.title = 'Updated Project';
      const updatedProject = { _id: 'projectId123', title: 'Updated Project' };
      Project.findByIdAndUpdate.mockResolvedValue(updatedProject);

      await updateProject(req, res, next);

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith('projectId123', { title: 'Updated Project' }, { new: true, runValidators: true });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', project: updatedProject });
    });

    it('should handle errors', async () => {
      Project.findByIdAndUpdate.mockRejectedValue(new Error('Unable to update project data'));

      await updateProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unable to update project data' });
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      req.params.id = 'projectId123';
      const deletedProject = { _id: 'projectId123', title: 'Deleted Project' };
      Project.findByIdAndDelete.mockResolvedValue(deletedProject);

      await deleteProject(req, res, next);

      expect(Project.findByIdAndDelete).toHaveBeenCalledWith('projectId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', message: 'Project deleted successfully', project: deletedProject });
    });

    it('should handle errors', async () => {
      Project.findByIdAndDelete.mockRejectedValue(new Error('Unable to delete project data'));

      await deleteProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Unable to delete project data' });
    });
  });

  describe('getAllUserProjects', () => {
    it('should get all user projects', async () => {
      const projects = [{ _id: 'projectId123', title: 'Project 1' }];
      Project.find.mockResolvedValue(projects);

      await getAllUserProjects(req, res, next);

      expect(Project.find).toHaveBeenCalledWith({ $or: [{ owner: req.user._id }, { members: { $in: [req.user._id] } }] });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', length: projects.length, projects });
    });

    it('should handle errors', async () => {
      Project.find.mockRejectedValue(new Error('No projects found'));

      await getAllUserProjects(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'No projects found' });
    });
  });

  describe('getUserProject', () => {
    it('should get a user project', async () => {
      req.params.id = 'projectId123';
      const project = { _id: 'projectId123', title: 'Project 1' };
      Project.findById.mockResolvedValue(project);

      await getUserProject(req, res, next);

      expect(Project.findById).toHaveBeenCalledWith('projectId123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', project });
    });

    it('should handle errors', async () => {
      Project.findById.mockRejectedValue(new Error('No project found'));

      await getUserProject(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'No project found' });
    });
  });

  describe('addMember', () => {
    it('should add a member to a project', async () => {
      req.body.projectId = 'projectId123';
      const project = { _id: 'projectId123', members: ['memberId123'] };
      Project.findByIdAndUpdate.mockResolvedValue(project);

      await addMember(req, res, next);

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith('projectId123', { $addToSet: { members: req.userToAdd._id } }, { new: true, runValidators: true });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', project });
    });

    it('should handle errors', async () => {
      Project.findByIdAndUpdate.mockRejectedValue(new Error('Could not add user to project'));

      await addMember(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Could not add user to project' });
    });
  });

  describe('removeMember', () => {
    it('should remove a member from a project', async () => {
      req.body.projectId = 'projectId123';
      const project = { _id: 'projectId123', members: [] };
      Project.findByIdAndUpdate.mockResolvedValue(project);

      await removeMember(req, res, next);

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith('projectId123', { $pull: { members: req.userToAdd._id } }, { new: true, runValidators: true });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', project });
    });

    it('should handle errors', async () => {
      Project.findByIdAndUpdate.mockRejectedValue(new Error('Could not remove member from project'));

      await removeMember(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Could not remove member from project' });
    });
  });
});
