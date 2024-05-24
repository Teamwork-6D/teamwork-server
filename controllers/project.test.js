import mongoose from 'mongoose';
import * as projectController from './project.js';
import Project from '../models/project.js';


jest.mock('../models/project');


describe('Project Controller Test', () => {
 afterEach(() => {
   jest.clearAllMocks();
 });


 it('should create a project successfully', async () => {
   const req = {
     body: { title: 'New Project' },
     user: { _id: new mongoose.Types.ObjectId() },
   };
   const res = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   };


   const createdProject = { ...req.body, owner: req.user._id, _id: new mongoose.Types.ObjectId() };
   Project.create.mockResolvedValue(createdProject);


   await projectController.createProject(req, res);


   expect(Project.create).toHaveBeenCalledWith({
     title: req.body.title,
     owner: req.user._id,
   });
   expect(res.status).toHaveBeenCalledWith(201);
   expect(res.json).toHaveBeenCalledWith({
     status: 'success',
     project: createdProject,
   });
 });


 it('should handle errors in createProject', async () => {
   const req = {
     body: { title: 'New Project' },
     user: { _id: new mongoose.Types.ObjectId() },
   };
   const res = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   };


   Project.create.mockRejectedValue(new Error('Unable to create project'));


   await projectController.createProject(req, res);


   expect(res.status).toHaveBeenCalledWith(400);
   expect(res.json).toHaveBeenCalledWith({
     status: 'error',
     message: 'Unable to create project',
   });
 });
});



