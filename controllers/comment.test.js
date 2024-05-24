import mongoose from 'mongoose';
import * as commentService from './comment'; 
import Comment from '../models/comment';

jest.mock('../models/comment');

describe('Comment Service Test', () => {
  beforeAll(async () => {
    mongoose.connect = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a comment successfully', async () => {
    const req = {
      body: {
        body: 'New Comment',
        taskId: new mongoose.Types.ObjectId(),
        projectId: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const createdComment = { ...req.body, _id: new mongoose.Types.ObjectId() };
    Comment.create.mockResolvedValue(createdComment);

    await commentService.createComment(req, res);

    expect(Comment.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      comment: createdComment,
    });
  });

  it('should handle errors in createComment', async () => {
    const req = {
      body: {
        body: 'New Comment',
        taskId: new mongoose.Types.ObjectId(),
        projectId: new mongoose.Types.ObjectId(),
        user: new mongoose.Types.ObjectId(),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Comment.create.mockRejectedValue(new Error('Unable to create comments'));

    await commentService.createComment(req, res);

    expect(Comment.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'Unable to create comments',
    });
  });

  it('should delete a comment successfully', async () => {
    const req = {
      params: { id: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const deletedComment = { _id: req.params.id };
    Comment.findByIdAndDelete.mockResolvedValue(deletedComment);

    const result = await commentService.deleteComment(req, res);

    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      comment: deletedComment,
    });
    expect(result).toEqual(deletedComment);
  });

  it('should get all task comments successfully', async () => {
    const req = {
      body: { taskId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const comments = [
      { taskId: req.body.taskId, body: 'Comment 1' },
      { taskId: req.body.taskId, body: 'Comment 2' },
    ];
    Comment.find.mockResolvedValue(comments);

    await commentService.getAllTaskComments(req, res);

    expect(Comment.find).toHaveBeenCalledWith({ taskId: req.body.taskId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      comments,
    });
  });

  it('should handle errors in getAllTaskComments', async () => {
    const req = {
      body: { taskId: new mongoose.Types.ObjectId() },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Comment.find.mockRejectedValue(new Error('Unable to fetch comments'));

    await commentService.getAllTaskComments(req, res);

    expect(Comment.find).toHaveBeenCalledWith({ taskId: req.body.taskId });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'failure',
      message: 'unable to fetch comments',
    });
  });
});
