// auth.Controller.mjs
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import sendResetPasswordEmail from '../utils/sendEmail.js';

// Register function
export const register = async (req, res) => {
  const {
    email,
    username,
    password,
    companyName,
    companyAddress,
    cr12,
    auctioneeringLicense,
  } = req.body;

  try {
    // Validate email
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validate username
    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to DB
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        company: {
          create: {
            companyName,
            companyAddress,
          },
        },
      },
      include: {
        company: true,
      },
    });

    // Ensure cr12 is an array or convert if not
    console.log('cr12: ', cr12);
    const cr12Array = Array.isArray(cr12) ? cr12 : cr12 ? [cr12] : [];

    // Ensure auctioneeringLicense is an array or convert if not
    console.log('auctioneeringLicense: ', auctioneeringLicense);
    const auctioneeringLicenseArray = Array.isArray(auctioneeringLicense)
      ? auctioneeringLicense
      : auctioneeringLicense
      ? [auctioneeringLicense]
      : [];

    // Map over cr12Array and auctioneeringLicenseArray to create documents
    const cr12Documents = cr12Array.map((url) => ({
      documentType: 'cr12',
      url,
      userId: newUser.id,
    }));
    const auctioneeringLicenseDocuments = auctioneeringLicenseArray.map(
      (url) => ({
        documentType: 'auctioneeringLicense',
        url,
        userId: newUser.id,
      })
    );

    // Create documents in the database
    await prisma.document.createMany({
      data: [...cr12Documents, ...auctioneeringLicenseDocuments],
    });

    // Generate token and send to user
    const age = 1000 * 60 * 60 * 24 * 2; // 2 days
    const token = jwt.sign(
      { id: newUser.id, isAdmin: false },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // Clear sensitive fields before sending user data
    newUser.password = undefined;

    // Set cookie and respond with user data and token
    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: age,
        sameSite: 'none', // Allows cross-site requests
        secure: true, // Ensures the cookie is only sent over HTTPS
      })
      .status(200)
      .json(newUser);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

/* Login */
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials!' });

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: 'Invalid Credentials!' });

    // Generate token and send to user
    const age = 1000 * 60 * 60 * 24 * 2;
    const token = jwt.sign(
      { id: user.id, isAdmin: false },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: age,
        sameSite: 'none', // Allows cross-site requests
        secure: true, // Ensures the cookie is only sent over HTTPS
      })
      .status(200)
      .json({ ...user, password: undefined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to login!' });
  }
};

/* Logout */
export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout Successful' });
};

/* Forgot Password */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
    const resetLink = `${process.env.CLIENT_URL}/resetPassword?token=${token}`;
    await sendResetPasswordEmail(user.email, resetLink);

    res.status(200).json({ message: 'Reset password email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email!' });
  }
};

/* Reset Password */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (err) {
    console.error(err);
    res.status;
  }
};
