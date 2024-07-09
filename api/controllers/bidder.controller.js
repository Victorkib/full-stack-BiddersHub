import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new bidder
export const registerBidder = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if bidder with the same email already exists
    const existingBidderEmail = await prisma.bidder.findUnique({
      where: { email },
    });

    if (existingBidderEmail) {
      console.log('Bidder with this email already exists:', email);
      return res
        .status(400)
        .json({ error: 'Bidder with this email already exists' });
    }

    // Check if bidder with the same username already exists
    const existingBidderUserName = await prisma.bidder.findUnique({
      where: { username },
    });

    if (existingBidderUserName) {
      console.log('Bidder with this username already exists:', username);
      return res
        .status(400)
        .json({ error: 'Bidder with this username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new bidder
    const newBidder = await prisma.bidder.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Generate token and send in a cookie
    const age = 1000 * 60 * 60 * 24 * 2; // 2 days
    const token = jwt.sign({ id: newBidder.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });

    newBidder.password = undefined;

    // Set cookie and respond with token and newBidder data
    res
      .status(201)
      .json({ message: 'Bidder registered successfully', newBidder, token });
  } catch (error) {
    console.error('Error registering bidder:', error);
    res.status(500).json({ error: 'Failed to register bidder' });
  }
};

// Log in a bidder
export const loginBidder = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find bidder by email
    const bidder = await prisma.bidder.findUnique({ where: { email } });

    // If bidder not found, return 404
    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, bidder.password);

    // If passwords do not match, return 401
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token and send in a cookie
    const token = jwt.sign({ id: bidder.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '2d',
    });

    // Clear sensitive fields before sending bidder data
    bidder.password = undefined;

    // Set cookie and respond with token and bidder data
    res
      .cookie('biddersToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        // secure: true, // Uncomment in production to ensure cookie is only sent over HTTPS
        // sameSite: 'None', // Uncomment for cross-site requests
      })
      .status(200)
      .json({ message: 'Login successful', bidder, token });
  } catch (error) {
    console.error('Error logging in bidder:', error);
    res.status(500).json({ error: 'Failed to log in bidder' });
  }
};

// Logout a bidder (optional implementation)
export const logoutBidder = async (req, res) => {
  // Implement your logout logic here
  res
    .clearCookie('biddersToken')
    .status(200)
    .json({ message: 'Logout successful' });
};

// Forgot password functionality (implement as needed)
export const forgotPassword = async (req, res) => {
  // Implement your forgot password logic here
  res.status(200).json({ message: 'Forgot password request received' });
};

// Reset password functionality (implement as needed)
export const resetPassword = async (req, res) => {
  // Implement your reset password logic here
  res.status(200).json({ message: 'Password reset successful' });
};
