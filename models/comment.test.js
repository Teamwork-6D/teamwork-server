// comment.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Comment from './comment'; // Adjust the import path if necessary

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Comment.deleteMany();
});

describe('Comment Model Test', () => {
  it('should create & save a comment successfully', async () => {
    const validComment = new Comment({
      body: 'This is a test comment',
      taskId: new mongoose.Types.ObjectId(),
      projectId: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId(),
    });
    const savedComment = await validComment.save();
    expect(savedComment._id).toBeDefined();
    expect(savedComment.body).toBe(validComment.body);
    expect(savedComment.taskId).toBe(validComment.taskId);
    expect(savedComment.projectId).toBe(validComment.projectId);
    expect(savedComment.user).toBe(validComment.user);
  });

  it('should fail to create comment without required fields', async () => {
    const commentWithoutRequiredFields = new Comment({});
    let err;
    try {
      await commentWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.body).toBeDefined();
    expect(err.errors.taskId).toBeDefined();
    expect(err.errors.projectId).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });
});
