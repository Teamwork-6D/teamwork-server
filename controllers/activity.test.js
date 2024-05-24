// activity.test.js

import Activity from '../models/activity.js';
import { createActivity, updateActivity, deleteActivity, getAllProjectActivities } from './activity.js';

jest.mock('../models/activity.js');

describe('Activity Service Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an activity successfully', async () => {
    const activityData = {
      projectId: 'project123',
      message: 'Test message',
      task: 'task123',
      fromColumn: 'column123',
      toColumn: 'column456',
      user: 'user123',
    };

    const createdActivity = { ...activityData, _id: 'activity123' };
    Activity.create.mockResolvedValue(createdActivity);

    const result = await createActivity(activityData);

    expect(Activity.create).toHaveBeenCalledWith(activityData);
    expect(result).toEqual(createdActivity);
  });

  it('should update an activity successfully', async () => {
    const activityData = {
      _id: 'activity123',
      projectId: 'project123',
      message: 'Updated message',
      task: 'task123',
      fromColumn: 'column123',
      toColumn: 'column456',
    };

    const updatedActivity = { ...activityData };
    Activity.findByIdAndUpdate.mockResolvedValue(updatedActivity);

    const result = await updateActivity(activityData);

    expect(Activity.findByIdAndUpdate).toHaveBeenCalledWith(activityData._id, {
      projectId: activityData.projectId,
      message: activityData.message,
      task: activityData.task,
      fromColumn: activityData.fromColumn,
      toColumn: activityData.toColumn,
    });
    expect(result).toEqual(updatedActivity);
  });

  it('should delete an activity successfully', async () => {
    const activityData = {
      _id: 'activity123',
    };

    const deletedActivity = { _id: activityData._id };
    Activity.findByIdAndDelete.mockResolvedValue(deletedActivity);

    const result = await deleteActivity(activityData);

    expect(Activity.findByIdAndDelete).toHaveBeenCalledWith(activityData._id);
    expect(result).toEqual(deletedActivity);
  });

  it('should get all project activities successfully', async () => {
    const req = {
      headers: { projectid: 'project123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const activities = [
      { projectId: 'project123', message: 'Activity 1' },
      { projectId: 'project123', message: 'Activity 2' },
    ];
    Activity.find.mockResolvedValue(activities);

    await getAllProjectActivities(req, res);

    expect(Activity.find).toHaveBeenCalledWith({ projectId: req.headers.projectid });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      activities,
    });
  });

  it('should handle errors in getAllProjectActivities', async () => {
    const req = {
      headers: { projectid: 'project123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Activity.find.mockRejectedValue(new Error('Unable to fetch activities'));

    await getAllProjectActivities(req, res);

    expect(Activity.find).toHaveBeenCalledWith({ projectId: req.headers.projectid });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'Unable to fetch activities',
    });
  });
});
