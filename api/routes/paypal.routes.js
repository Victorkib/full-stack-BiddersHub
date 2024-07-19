// paypal.routes.js
import express from 'express';
import { createOrder, captureOrder } from '../controllers/paypal.controller.js';
const router = express.Router(); // Import PayPal controllers

// PayPal Routes
router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);

export default router;
