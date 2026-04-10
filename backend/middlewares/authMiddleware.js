// Authentication Protection Middleware
import User from '../models/User.js';
import { verifyToken } from '../utils/generateToken.js';

export const protect = async (req, res, next) => {
  let token = req.cookies?.access_token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const parts = req.headers.authorization.split(' ');
    token = parts.length === 2 ? parts[1] : null;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  try {
    const decoded = verifyToken(token);

    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }

    return next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
};