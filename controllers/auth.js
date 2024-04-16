import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import util from 'util';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Handle register
export async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const newUser = await User.create({ firstName, lastName, email, password });
    const user = {
      id: newUser._id,
      token: signToken(newUser._id),
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
    };

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error creating user account.',
      stack: process.env.ENV === 'development' && error,
    });
  }
}

// Handle login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password.',
      });
    }

    const _user = {
      id: user._id,
      token: signToken(user._id),
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };

    res.status(201).json({
      status: 'success',
      user: _user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error logging into user account.',
      stack: process.env.ENV === 'development' && error,
    });
  }
}

export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 1) Check if there's no token
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not signed in! Please sign in to get access.',
    });
  }

  // 2) Validate token
  const decodedPayLoad = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  // 3) Check if user still exists
  const user = await User.findById(decodedPayLoad.id);

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'The user no longer exists.',
    });
  }

  // Grant access to route
  req.user = user;
  next();
}

export async function getUserToAdd(req, res, next) {
  try {
    const { userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });

    if (user) {
      req.userToAdd = user;
      next();
    } else {
      throw new Error(`User with email '${userEmail}' not found`);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'error',
      message: 'User to add not found',
    });
  }
}
