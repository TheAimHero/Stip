import crypto from 'crypto';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';

export function timedEqual(a, b) {
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function checkStrongPassword(password) {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
}

export async function compareHash(key, hash) {
  return await bcrypt.compare(key, hash);
}

export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

export function addCookie(res, token) {
  res.cookie('jwt', token, {
    secure: process.env.NODE_ENV === 'development' ? false : true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
}

export function checkPasswordChanged(passwordChangedAt, initializedAt) {
  if (parseInt(passwordChangedAt.getTime() / 1000, 10) > initializedAt) {
    return true;
  }
  return false;
}

export function extractToken(bearerToken) {
  if (!bearerToken.startsWith('Bearer')) return undefined;
  return bearerToken.split(' ')[1];
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
