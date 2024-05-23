// column.test.js

import mongoose from 'mongoose';
import * as columnService from './column'; // Adjust the import path if necessary
import Column from '../models/column';
import Project from '../models/project';

jest.mock('../models/column');
jest.mock('../models/project');

describe('Column Service Test', () => {
  beforeAll(async () => {
    mongoose.connect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a column successfully', async () => {
    const columnData = {
      title: 'New Column',
      tasksOrder: [],
      projectId: new mongoose.Types.ObjectId(),
    };

    const createdColumn = { ...columnData, _id: new mongoose.Types.ObjectId() };
    Column.create.mockResolvedValue(createdColumn);

    const result = await columnService.createColumn(columnData);

    expect(Column.create).toHaveBeenCalledWith(columnData);
    expect(result).toEqual(createdColumn);
  });

  it('should update a column successfully', async () => {
    const columnData = {
      _id: new mongoose.Types.ObjectId(),
      title: 'Updated Column',
      tasksOrder: [],
      projectId: new mongoose.Types.ObjectId(),
    };

    Column.findByIdAndUpdate.mockResolvedValue(columnData);

    const result = await columnService.updateColumn(columnData);

    expect(Column.findByIdAndUpdate).toHaveBeenCalledWith(columnData._id, {
      title: columnData.title,
      tasksOrder: columnData.tasksOrder,
      projectId: columnData.projectId,
    });
    expect(result).toEqual(columnData);
  });

  it('should delete a column successfully', async () => {
    const columnData = {
      _id: new mongoose.Types.ObjectId(),
    };

    const deletedColumn = { _id: columnData._id };
    Column.findByIdAndDelete.mockResolvedValue(deletedColumn);

    const result = await columnService.deleteColumn(columnData);

    expect(Column.findByIdAndDelete).toHaveBeenCalledWith(columnData._id);
    expect(result).toEqual(deletedColumn);
  });

  it('should change columns order successfully', async () => {
    const columnData = {
      projectId: new mongoose.Types.ObjectId(),
      columnsOrder: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    };

    const updatedProject = { columnsOrder: columnData.columnsOrder };
    Project.findOneAndUpdate.mockResolvedValue(updatedProject);

    const result = await columnService.changeColumnsOrder(columnData);

    expect(Project.findOneAndUpdate).toHaveBeenCalledWith(columnData.projectId, {
      columnsOrder: columnData.columnsOrder,
    });
    expect(result).toEqual(updatedProject);
  });

  it('should get all project columns successfully', async () => {
    const req = {
      body: { projectId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const columns = [
      { projectId: req.body.projectId, title: 'Column 1' },
      { projectId: req.body.projectId, title: 'Column 2' },
    ];
    Column.find.mockResolvedValue(columns);

    await columnService.getAllProjectColumns(req, res);

    expect(Column.find).toHaveBeenCalledWith({ projectId: req.body.projectId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      columns,
    });
  });

  it('should handle errors in getAllProjectColumns', async () => {
    const req = {
      body: { projectId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Column.find.mockRejectedValue(new Error('Unable to fetch columns'));

    await columnService.getAllProjectColumns(req, res);

    expect(Column.find).toHaveBeenCalledWith({ projectId: req.body.projectId });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'Unable to fetch activities',
    });
  });
});
