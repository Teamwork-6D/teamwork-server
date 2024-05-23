// task.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from './task'; // Adjust the import path if necessary

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
  await Task.deleteMany();
});

describe('Task Model Test', () => {
  it('should create & save a task successfully', async () => {
    const validTask = new Task({
      title: 'Test Task',
      body: 'This is a test task body',
      projectId: new mongoose.Types.ObjectId(),
      columnId: new mongoose.Types.ObjectId(),
    });
    const savedTask = await validTask.save();
    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(validTask.title);
    expect(savedTask.body).toBe(validTask.body);
    expect(savedTask.projectId).toBe(validTask.projectId);
    expect(savedTask.columnId).toBe(validTask.columnId);
  });

  it('should fail to create task without required fields', async () => {
    const taskWithoutRequiredFields = new Task({});
    let err;
    try {
      await taskWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.projectId).toBeDefined();
    expect(err.errors.columnId).toBeDefined();
  });
});
