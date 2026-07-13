import bcrypt from "bcryptjs";

const PASSWORD_MIN_LENGTH = 6;
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string) {
  if (username.length < USERNAME_MIN_LENGTH) {
    return "Username must be at least 3 characters.";
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return "Username must be at most 32 characters.";
  }

  if (!USERNAME_REGEX.test(username)) {
    return "Username can only contain letters, numbers, and underscores.";
  }

  return null;
}

export function validatePassword(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return "Password must be at least 6 characters.";
  }

  return null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
