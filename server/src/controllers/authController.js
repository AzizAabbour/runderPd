import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { createUser, findUserByEmail, sanitizeUser } from '../services/userStore.js';

function createToken(user) {
  return jwt.sign({ name: user.name, email: user.email }, JWT_SECRET, {
    subject: user.id,
    expiresIn: '7d',
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new ApiError(400, 'Name, email, and password are required.');
    }

    const existing = findUserByEmail(email);
    if (existing) {
      throw new ApiError(409, 'An account already exists with that email address.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      success: true,
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      throw new ApiError(400, 'Email and password are required.');
    }

    const user = findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid credentials.');
    }

    res.json({
      success: true,
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ success: true, user: req.user });
}

