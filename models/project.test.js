// project.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Project from './project'; // Adjust the import path if necessary

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
  await Project.deleteMany();
});

describe('Project Model Test', () => {
  it('should create & save a project successfully', async () => {
    const validProject = new Project({
      title: 'Test Project',
      members: [new mongoose.Types.ObjectId()],
      columnsOrder: [new mongoose.Types.ObjectId()],
      owner: new mongoose.Types.ObjectId(),
    });
    const savedProject = await validProject.save();
    expect(savedProject._id).toBeDefined();
    expect(savedProject.title).toBe(validProject.title);
    expect(savedProject.members).toEqual(expect.arrayContaining(validProject.members));
    expect(savedProject.columnsOrder).toEqual(expect.arrayContaining(validProject.columnsOrder));
    expect(savedProject.owner).toBe(validProject.owner);
  });

  it('should fail to create project without required fields', async () => {
    const projectWithoutRequiredFields = new Project({});
    let err;
    try {
      await projectWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
    expect(err.errors.owner).toBeDefined();
  });
});
