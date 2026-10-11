import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!process.env.JWT_SECRET) {
        console.error('[Auth Error] JWT_SECRET environment variable is missing.');
        return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not configured' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token header' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Admin authorization required' });
};
