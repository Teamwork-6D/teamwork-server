import mongoose from 'mongoose';
import Column from './column';

// Mocking mongoose functions
jest.mock('mongoose');

describe('Column Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new column with valid fields', async () => {
    // Mock data
    const mockColumnData = {
      title: 'Sample column title',
      tasksOrder: [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()],
      projectId: mongoose.Types.ObjectId(),
    };

    // Mock save function of Column model
    const saveMock = jest.fn().mockResolvedValue(mockColumnData);

    // Creating a new column with the mocked save function
    const newColumn = new Column({
      ...mockColumnData,
      save: saveMock,
    });

    // Assertions
    expect(newColumn.title).toEqual(mockColumnData.title);
    expect(newColumn.tasksOrder).toEqual(mockColumnData.tasksOrder);
    expect(newColumn.projectId).toEqual(mockColumnData.projectId);

    // Ensure save function was called with the correct data
    expect(saveMock).toHaveBeenCalled();
  });

  it('should throw error when required fields are missing', async () => {
    // Mock data with missing required fields
    const mockColumnData = {
      tasksOrder: [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()],
    };

    try {
      // Creating a new column with missing required fields
      new Column(mockColumnData);
    } catch (error) {
      // Assert that error is thrown and contains the correct message
      expect(error.message).toContain('Task column must have a title');
      expect(error.message).toContain('Task column must belong to a project');
    }
  });
});
