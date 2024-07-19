import express from 'express';
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify/:userId/:token', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/resend-verification', resendVerificationEmail);

export default router;
