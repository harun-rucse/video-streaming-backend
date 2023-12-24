import multer from "multer";
import AppError from "../utils/app-error.js";
import logger from "../logger/index.js";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const fieldName = `${Object.keys(err.keyPattern)}`;
  const message = `${err.keyValue[fieldName]} ${fieldName} already exists`;

  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token! Please login again.", 400);
};

const handleJWTExpiredError = () => {
  return new AppError("Token has expired. Please login again.", 401);
};

const handleMulterUnexpectedFieldError = (err) => {
  return new AppError(`Image Upload failed. Unexpected field ${err.field}`, 400);
};

const sendErrorDev = (err, req, res) => {
  logger.error(err.message);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorTest = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log unknown errors
    logger.error(err);
    // console.log(err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.name === "MulterError") {
      if (error.code === "LIMIT_UNEXPECTED_FILE") error = handleMulterUnexpectedFieldError(error);
    }

    if (process.env.NODE_ENV === "test") {
      sendErrorTest(error, req, res);
    } else if (process.env.NODE_ENV === "production") {
      sendErrorProd(error, req, res);
    }
  }
};

export default globalErrorHandler;
