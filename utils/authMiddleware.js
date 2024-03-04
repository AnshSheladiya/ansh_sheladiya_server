import jwt from 'jsonwebtoken';
import User from '../models/user';

const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

const authMiddleware = (handler) => async (req, res) => {
  // Check if the Authorization header exists
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Unauthorized: Bearer token missing' });
  }

  // Extract the token from the Authorization header
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    const user=await User.findById(decoded.userId)
    // Set req.user to the decoded token payload
    req.user = user;

    // Call the handler function
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
