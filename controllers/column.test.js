import Column from '../models/column.js';
import Project from '../models/project.js';
import Task from '../models/task.js';
import { createActivity } from './activity.js';
import { createColumn, updateColumn, deleteColumn, changeColumnsOrder, getAllProjectColumns } from './column.js';

jest.mock('../models/column.js');
jest.mock('../models/project.js');
jest.mock('../models/task.js');
jest.mock('./activity.js');

describe('Column Service Test', () => {
  let user;

  beforeAll(() => {
    user = { fullName: 'Test User', id: 'user123' }; // Mock user
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createColumn', () => {
    it('should create a column successfully', async () => {
      const columnData = {
        title: 'New Column',
        tasksOrder: [],
        projectId: 'project123',
        user
      };

      const createdColumn = { ...columnData, _id: 'column123' };
      Column.create.mockResolvedValue(createdColumn);
      Project.findByIdAndUpdate.mockResolvedValue({});
      createActivity.mockResolvedValue({});

      const result = await createColumn(columnData);

      expect(Column.create).toHaveBeenCalledWith({ title: columnData.title, tasksOrder: columnData.tasksOrder, projectId: columnData.projectId });
      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(columnData.projectId, {
        $addToSet: { columnsOrder: createdColumn._id }
      });
      expect(createActivity).toHaveBeenCalledWith({
        projectId: columnData.projectId,
        message: `'${user.fullName}' create a new column '${createdColumn.title}'`,
        fromColumn: createdColumn._id,
        user: user.id
      });
      expect(result).toEqual(createdColumn);
    });
  });

  describe('updateColumn', () => {
    it('should update a column successfully', async () => {
      const columnData = {
        _id: 'column123',
        title: 'Updated Column',
        user,
        oldColumn: { title: 'Old Column' }
      };

      const updatedColumn = { ...columnData };
      Column.findByIdAndUpdate.mockResolvedValue(updatedColumn);
      createActivity.mockResolvedValue({});

      const result = await updateColumn(columnData);

      expect(Column.findByIdAndUpdate).toHaveBeenCalledWith(columnData._id, { title: columnData.title }, { new: true });
      expect(createActivity).toHaveBeenCalledWith({
        projectId: columnData._id,
        message: `'${user.fullName}' edited column title '${columnData.oldColumn.title}' -> '${updatedColumn.title}'`,
        fromColumn: updatedColumn._id,
        user: user.id
      });
      expect(result).toEqual(updatedColumn);
    });
  });

  describe('deleteColumn', () => {
    it('should delete a column successfully', async () => {
      const columnData = {
        _id: 'column123',
        projectId: 'project123',
        user
      };

      const deletedColumn = { _id: columnData._id, title: 'Deleted Column' };
      Column.findByIdAndDelete.mockResolvedValue(deletedColumn);
      Project.findByIdAndUpdate.mockResolvedValue({});
      Task.deleteMany.mockResolvedValue({});
      createActivity.mockResolvedValue({});

      const result = await deleteColumn(columnData);

      expect(Column.findByIdAndDelete).toHaveBeenCalledWith(columnData._id);
      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(columnData.projectId, {
        $pull: { columnsOrder: columnData._id }
      });
      expect(Task.deleteMany).toHaveBeenCalledWith({ columnId: deletedColumn._id });
      expect(createActivity).toHaveBeenCalledWith({
        projectId: columnData.projectId,
        message: `'${user.fullName}' deleted a column '${deletedColumn.title}' and all it's data`,
        user: user.id
      });
      expect(result).toEqual(deletedColumn);
    });
  });

  describe('changeColumnsOrder', () => {
    it('should change columns order successfully', async () => {
      const columnData = {
        projectId: 'project123',
        columnsOrder: ['column1', 'column2']
      };

      const updatedProject = { columnsOrder: columnData.columnsOrder };
      Project.findOneAndUpdate.mockResolvedValue(updatedProject);

      const result = await changeColumnsOrder(columnData);

      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(columnData.projectId, { columnsOrder: columnData.columnsOrder });
      expect(result).toEqual(updatedProject);
    });
  });

  describe('getAllProjectColumns', () => {
    it('should get all project columns successfully', async () => {
      const req = {
        headers: { projectid: 'project123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const columns = [
        { projectId: req.headers.projectid, title: 'Column 1' },
        { projectId: req.headers.projectid, title: 'Column 2' },
      ];
      Column.find.mockResolvedValue(columns);

      await getAllProjectColumns(req, res);

      expect(Column.find).toHaveBeenCalledWith({ projectId: req.headers.projectid });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        columns,
      });
    });

    it('should handle errors in getAllProjectColumns', async () => {
      const req = {
        headers: { projectid: 'project123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Column.find.mockRejectedValue(new Error('Unable to fetch columns'));

      await getAllProjectColumns(req, res);

      expect(Column.find).toHaveBeenCalledWith({ projectId: req.headers.projectid });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'failure',
        message: 'Unable to fetch activities',
      });
    });
  });
});
