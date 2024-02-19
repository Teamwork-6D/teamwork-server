class AppError extends Error {
  constructor(message, statusCode, clientCode = 1) {
    super(message);
    this.clientCode = clientCode;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Prevents pollution of stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
