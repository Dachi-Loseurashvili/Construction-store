import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Ensure the .js extension is here

// This replaces 'verifyToken' and provides the 'protect' export
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Priority 1: HttpOnly cookie (new secure method)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Priority 2: Authorization header (backward compat during transition)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'techspire_secret');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

// This provides the 'admin' export your products route is looking for
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};