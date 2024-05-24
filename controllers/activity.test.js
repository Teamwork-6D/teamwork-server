// activity.test.js

import mongoose from 'mongoose';
import * as activityService from './activity'; // Adjust the import path if necessary
import Activity from '../models/activity';

jest.mock('../models/activity');

describe('Activity Service Test', () => {
  beforeAll(async () => {
    mongoose.connect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create an activity successfully', async () => {
    const activityData = {
      projectId: new mongoose.Types.ObjectId(),
      message: 'Test activity message',
      task: new mongoose.Types.ObjectId(),
      fromColumn: new mongoose.Types.ObjectId(),
      toColumn: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    };

    const createdActivity = { ...activityData, _id: new mongoose.Types.ObjectId() };
    Activity.create.mockResolvedValue(createdActivity);

    const result = await activityService.createActivity(activityData);

    expect(Activity.create).toHaveBeenCalledWith(activityData);
    expect(result).toEqual(createdActivity);
  });

  it('should update an activity successfully', async () => {
    const activityData = {
      _id: new mongoose.Types.ObjectId(),
      projectId: new mongoose.Types.ObjectId(),
      message: 'Updated activity message',
      task: new mongoose.Types.ObjectId(),
      fromColumn: new mongoose.Types.ObjectId(),
      toColumn: new mongoose.Types.ObjectId(),
    };

    Activity.findByIdAndUpdate.mockResolvedValue(activityData);

    const result = await activityService.updateActivity(activityData);

    expect(Activity.findByIdAndUpdate).toHaveBeenCalledWith(activityData._id, {
      projectId: activityData.projectId,
      message: activityData.message,
      task: activityData.task,
      fromColumn: activityData.fromColumn,
      toColumn: activityData.toColumn,
    });
    expect(result).toEqual(activityData);
  });

  it('should delete an activity successfully', async () => {
    const activityData = {
      _id: new mongoose.Types.ObjectId(),
    };

    const deletedActivity = { _id: activityData._id };
    Activity.findByIdAndDelete.mockResolvedValue(deletedActivity);

    const result = await activityService.deleteActivity(activityData);

    expect(Activity.findByIdAndDelete).toHaveBeenCalledWith(activityData._id);
    expect(result).toEqual(deletedActivity);
  });

  it('should get all project activities successfully', async () => {
    const req = {
      body: { projectId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const activities = [
      { projectId: req.body.projectId, message: 'Activity 1' },
      { projectId: req.body.projectId, message: 'Activity 2' },
    ];
    Activity.find.mockResolvedValue(activities);

    await activityService.getAllProjectActivities(req, res);

    expect(Activity.find).toHaveBeenCalledWith({ projectId: req.body.projectId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      activities,
    });
  });

  it('should handle errors in getAllProjectActivities', async () => {
    const req = {
      body: { projectId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Activity.find.mockRejectedValue(new Error('Unable to fetch activities'));

    await activityService.getAllProjectActivities(req, res);

    expect(Activity.find).toHaveBeenCalledWith({ projectId: req.body.projectId });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'Unable to fetch activities',
    });
  });
});
