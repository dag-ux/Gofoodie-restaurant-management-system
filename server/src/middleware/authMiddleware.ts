import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gofoodie-super-secret-key';

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

// 1. Protect Route (Checks if user is logged in)
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; 
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.user = decoded; 
    next(); 
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed or expired' });
  }
};

// 2. Admin Only Route (Checks if user is an ADMIN)
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next(); 
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};