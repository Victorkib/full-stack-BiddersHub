import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createWallet } from './walletController.js';

// controllers/bidderController.js
//create Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

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

    // Create wallet for the new bidder
    const wallet = await createWallet(newBidder.id);

    if (!wallet) {
      return res.status(400).json({ error: 'Error creating bidders wallet' });
    }

    newBidder.password = undefined;

    console.log(newBidder);
    console.log(wallet);
    // Set cookie and respond with token and newBidder data
    res.status(201).json({
      message: 'Bidder registered successfully',
      newBidder,
      wallet,
    });
  } catch (error) {
    console.error('Error registering bidder:', error);
    res.status(500).json({ error: 'Failed to register bidder' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// Log in a bidder
export const loginBidder = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find bidder by email
    const bidder = await prisma.bidder.findUnique({
      where: { email },
      include: { wallet: true },
    });
    console.log('bidder: ', bidder);
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
    const token = createToken(bidder.id);

    // Clear sensitive fields before sending bidder data
    bidder.password = undefined;

    // Set cookie and respond with token and bidder data
    console.log('LoggedInBidder: ', bidder);
    res
      .cookie('biddersToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        secure: true, // Uncomment in production to ensure cookie is only sent over HTTPS
        sameSite: 'None', // Uncomment for cross-site requests
      })
      .status(200)
      .json({ message: 'Login successful', bidder, token });
  } catch (error) {
    console.error('Error logging in bidder:', error);
    res.status(500).json({ error: 'Failed to log in bidder' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// Get a bidder
export const bidderProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const bidder = await prisma.bidder.findUnique({
      where: { id },
    });

    if (!bidder) {
      return res.status(400).json({ error: 'No such bidder' });
    }
    bidder.password = undefined;
    console.log('bidder:', bidder);
    return res.status(200).json(bidder);
  } catch (error) {
    console.error('Error fetching bidder:', error);
    res.status(500).json({ error: 'Failed to fetch bidder' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// Update a bidder's profile picture
export const updateProfilePic = async (req, res) => {
  const { id } = req.params;
  const { profile } = req.body; // Assuming `profile` contains the updated profile picture URL

  try {
    const bidder = await prisma.bidder.findUnique({
      where: { id },
    });

    if (!bidder) {
      return res.status(404).json({ error: 'Bidder not found' });
    }

    // Update the bidder's profile picture
    const updatedBidder = await prisma.bidder.update({
      where: { id },
      data: {
        profile,
      },
    });

    // Remove sensitive data from the response
    delete updatedBidder.password;
    console.log(updatedBidder);
    return res.status(200).json(updatedBidder);
  } catch (error) {
    console.error('Error updating bidder profile picture:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update bidder profile picture' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

// Logout a bidder (optional implementation)
export const logoutBidder = async (req, res) => {
  // Implement your logout logic here
  res
    .status(200)
    .cookie('biddersToken', '', { maxAge: new Date(0) })
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
