import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  email?: string;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const payload = authService.verifyAccessToken(token);
    req.userId = payload.userId;
    req.email = payload.email;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuthenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const payload = authService.verifyAccessToken(token);
      req.userId = payload.userId;
      req.email = payload.email;
    } catch {
      // Token is invalid, but it's optional so we continue
    }
  }

  next();
}
