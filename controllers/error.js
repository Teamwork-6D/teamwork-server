const AppError = require("../utils/appError");

// Database related errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Database entry duplicate errors
const handleDuplicateFieldDB = (err) => {
  const { keyValue } = err;
  const value = Object.values(keyValue);
  const message = `Duplicate Field: ${value} already exists.`;
  return new AppError(message, 400);
};

// Database validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data, ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// JSON web token errors
const handleJWTError = () =>
  new AppError("Invalid token. Please sign in again!", 401);

// Sending error in development environment
const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    clientCode: err.clientCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Sending error in production environment
const sendErrorProd = (err, res) => {
  // For operational errors i.e errors caused by developer
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      clientCode: err.clientCode,
    });
  } else {
    // Programming or other unknown errors
    // 1) Log error
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();

    sendErrorProd(err, res);
  }
};
