import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
  }
};
