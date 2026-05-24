import { ApiError } from '../utils/ApiError.js';

export function notFoundHandler(_req, _res, next) {
  next(new ApiError(404, 'The requested endpoint does not exist.'));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details ?? null,
  });
}

