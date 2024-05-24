// user.test.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from './user'; // Adjust the import path if necessary

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
  await User.deleteMany();
});

describe('User Model Test', () => {
  it('should create & save a user successfully', async () => {
    const validUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      email: 'john.doe@example.com',
    });
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe(validUser.firstName);
    expect(savedUser.lastName).toBe(validUser.lastName);
    expect(savedUser.email).toBe(validUser.email);

    // Check that the password is hashed
    const isPasswordHashed = await bcrypt.compare('password123', savedUser.password);
    expect(isPasswordHashed).toBe(true);
  });

  it('should fail to create user without required fields', async () => {
    const userWithoutRequiredFields = new User({});
    let err;
    try {
      await userWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.firstName).toBeDefined();
    expect(err.errors.lastName).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });

  it('should not allow duplicate emails', async () => {
    const user1 = new User({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      email: 'john.doe@example.com',
    });
    await user1.save();

    const user2 = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'password456',
      email: 'john.doe@example.com',
    });
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.mongo.MongoServerError);
    expect(err.code).toBe(11000); // Duplicate key error code
  });

  it('should hash the password before saving', async () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      email: 'john.doe@example.com',
    });
    await user.save();
    const isPasswordHashed = await bcrypt.compare('password123', user.password);
    expect(isPasswordHashed).toBe(true);
  });

  it('should correctly compare passwords', async () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      email: 'john.doe@example.com',
    });
    await user.save();

    const isMatch = await user.correctPassword('password123', user.password);
    expect(isMatch).toBe(true);

    const isNotMatch = await user.correctPassword('wrongpassword', user.password);
    expect(isNotMatch).toBe(false);
  });
});
