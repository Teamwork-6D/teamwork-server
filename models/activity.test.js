import mongoose from 'mongoose';
import Activity from './activity'; 

jest.mock('./activity');

describe('Activity Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new activity with valid fields', async () => {
    const mockActivityData = {
      projectId: new mongoose.Types.ObjectId(),
      message: 'Sample activity message',
      task: new mongoose.Types.ObjectId(),
      fromColumn: new mongoose.Types.ObjectId(),
      toColumn: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    };

    Activity.create.mockResolvedValue(mockActivityData);

    const newActivity = await Activity.create(mockActivityData);

    expect(newActivity.projectId).toEqual(mockActivityData.projectId);
    expect(newActivity.message).toEqual(mockActivityData.message);
    expect(newActivity.task).toEqual(mockActivityData.task);
    expect(newActivity.fromColumn).toEqual(mockActivityData.fromColumn);
    expect(newActivity.toColumn).toEqual(mockActivityData.toColumn);
    expect(newActivity.user).toEqual(mockActivityData.user);

    expect(Activity.create).toHaveBeenCalledWith(mockActivityData);
  });

  it('should throw error when required fields are missing', async () => {
    const mockActivityData = {
      message: 'Sample activity message',
      user: new mongoose.Types.ObjectId(),
    };

    try {
      await Activity.create(mockActivityData);
    } catch (error) {
      expect(error.message).toContain('Activity must belong to a project');
      expect(error.message).toContain('Activity must have a message');
      expect(error.message).toContain('An activity must be fired off by a user');
    }
  });
});
