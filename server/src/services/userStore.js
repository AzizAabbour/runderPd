import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const users = [];
const demoPasswordHash = await bcrypt.hash('Demo1234!', 10);

users.push({
  id: randomUUID(),
  name: 'Demo User',
  email: 'demo@filetools.app',
  passwordHash: demoPasswordHash,
  createdAt: new Date().toISOString(),
});

export function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function createUser({ name, email, passwordHash }) {
  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

