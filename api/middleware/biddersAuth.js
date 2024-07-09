import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js'; // Import your Prisma instance

export const authenticateBidder = async (req, res, next) => {
  const token = req.cookies.biddersToken;

  if (!token) {
    return res.status(401).json({ message: 'Not Authenticated!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Query the database to find the user
    const user = await prisma.bidder.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(403).json({ message: 'Invalid User!' });
    }

    // Attach the user object to the request for further use in routes
    req.bidderId = user.id;
    console.log('logged in user:', user.id);

    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(403).json({ message: 'Token is not Valid!' });
  }
};
