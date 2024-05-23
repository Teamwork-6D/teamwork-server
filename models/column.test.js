// column.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Column from './column'; // Adjust the import path if necessary

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
  await Column.deleteMany();
});

describe('Column Model Test', () => {
  it('should create & save a column successfully', async () => {
    const validColumn = new Column({
      title: 'To Do',
      tasksOrder: [],
      projectId: new mongoose.Types.ObjectId(),
    });
    const savedColumn = await validColumn.save();
    expect(savedColumn._id).toBeDefined();
    expect(savedColumn.title).toBe(validColumn.title);
    expect(savedColumn.tasksOrder).toEqual(expect.arrayContaining([]));
    expect(savedColumn.projectId).toBe(validColumn.projectId);
  });

  it('should fail to create column without required fields', async () => {
    const columnWithoutRequiredFields = new Column({});
    let err;
    try {
      await columnWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.projectId).toBeDefined();
  });
});
