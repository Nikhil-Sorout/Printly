import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access token is required'
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    console.log('User verified')
    next();
  } catch (error) {
    console.log("Got you", token)
    return res.status(403).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
}; 