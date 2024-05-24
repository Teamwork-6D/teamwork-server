module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  verbose: true,
  maxWorkers: 2, // Reduce the number of workers to help with child process issues
};
