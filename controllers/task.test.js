// task.test.js

import mongoose from 'mongoose';
import * as taskService from './task'; // Adjust the import path if necessary
import Task from '../models/task';

jest.mock('../models/task');

describe('Task Service Test', () => {
  beforeAll(async () => {
    mongoose.connect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a task successfully', async () => {
    const taskData = {
      title: 'New Task',
      body: 'Task body content',
      projectId: new mongoose.Types.ObjectId(),
      columnId: new mongoose.Types.ObjectId(),
    };

    const createdTask = { ...taskData, _id: new mongoose.Types.ObjectId() };
    Task.create.mockResolvedValue(createdTask);

    const result = await taskService.createTask(taskData);

    expect(Task.create).toHaveBeenCalledWith(taskData);
    expect(result).toEqual(createdTask);
  });

  it('should update a task successfully', async () => {
    const taskData = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Updated Task',
      body: 'Updated task body content',
      projectId: new mongoose.Types.ObjectId(),
      columnId: new mongoose.Types.ObjectId(),
    };

    Task.findByIdAndUpdate.mockResolvedValue(taskData);

    const result = await taskService.updateTask(taskData);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(taskData._id, {
      title: taskData.title,
      body: taskData.body,
      projectId: taskData.projectId,
      columnId: taskData.columnId,
    });
    expect(result).toEqual(taskData);
  });

  it('should delete a task successfully', async () => {
    const taskData = {
      _id: new mongoose.Types.ObjectId(),
    };

    const deletedTask = { _id: taskData._id };
    Task.findByIdAndDelete.mockResolvedValue(deletedTask);

    const result = await taskService.deleteTask(taskData);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith(taskData._id);
    expect(result).toEqual(deletedTask);
  });

  it('should get all project tasks successfully', async () => {
    const req = {
      body: { projectId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const tasks = [
      { projectId: req.body.projectId, title: 'Task 1' },
      { projectId: req.body.projectId, title: 'Task 2' },
    ];
    Task.find.mockResolvedValue(tasks);

    await taskService.getAllProjectTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({ projectId: req.body.projectId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      tasks,
    });
  });

  it('should handle errors in getAllProjectTasks', async () => {
    const req = {
      body: { projectId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Task.find.mockRejectedValue(new Error('Unable to fetch project tasks'));

    await taskService.getAllProjectTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({ projectId: req.body.projectId });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'Unable to fetch project tasks',
    });
  });
});
