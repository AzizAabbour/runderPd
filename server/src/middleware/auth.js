import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { findUserById, sanitizeUser } from '../services/userStore.js';

export function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required.');
    }

    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.sub);

    if (!user) {
      throw new ApiError(401, 'Session expired. Please sign in again.');
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired token.'));
  }
}

