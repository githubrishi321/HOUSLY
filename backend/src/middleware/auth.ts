import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided.' });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env['JWT_SECRET'] ?? 'fallback_secret';

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
