// auth.Controller.mjs
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import sendResetPasswordEmail from '../utils/sendEmail.js';
import { sendVerificationEmail } from '../utils/sendEmailVerification.js';
import { compareString } from '../utils/index.js';
import { ResendVerificationEmail } from '../utils/resendEmail.js';

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

    //send email verification
    const emailResult = await sendVerificationEmail(newUser);
    console.log('results of SendEMail: ' + emailResult.emailMessage);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error,
        // emailMessage: emailResult.emailMessage,
      });
    }

    // Clear sensitive fields before sending user data
    newUser.password = undefined;

    res
      .status(200)
      .json({ newUser, success: true, emailMessage: emailResult.emailMessage });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // Query the verification record using findUnique with id
    const result = await prisma.verification.findUnique({
      where: {
        userId: userId,
      },
    });

    if (result) {
      const { expiresAt, token: hashedToken } = result;

      if (expiresAt < Date.now()) {
        // If token has expired, delete verification and user record
        await prisma.verification.delete({
          where: {
            userId: userId,
          },
        });
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });
        return res.status(400).json({
          status: 'error',
          message: 'Verification token has expired.',
        });
      } else {
        // Verify token match
        const isMatch = await compareString(token, hashedToken);
        if (isMatch) {
          // Update user verified status
          await prisma.user.update({
            where: { id: userId },
            data: { verified: true },
          });

          // Delete verification record
          await prisma.verification.delete({
            where: { userId: userId },
          });

          return res.status(200).json({
            status: 'success',
            message: 'Email verified successfully',
          });
        } else {
          return res.status(400).json({
            status: 'error',
            message: 'Verification failed or link is invalid',
          });
        }
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification link. Try again later.',
      });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
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

    // Check if the user is verified
    if (!user.verified) {
      return res
        .status(404)
        .json({ message: 'Please verify your email first.', user });
    }

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
/* resend Verification Email */

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is already verified

    if (user.verified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Send the verification email
    const result = await ResendVerificationEmail(user);
    console.log(result);

    if (result.success) {
      return res.status(200).json({ message: 'Verification email resent' });
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error resending verification email:', error);
    return res
      .status(500)
      .json({ error: 'Failed to resend verification email' });
  }
};
