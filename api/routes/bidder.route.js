import express from 'express';
import {
  registerBidder,
  loginBidder,
  logoutBidder,
  forgotPassword,
  resetPassword,
} from '../controllers/bidder.controller.js';
import { createBid, getHighestBid } from '../controllers/bids.controller.js';
import { authenticateBidder } from '../middleware/biddersAuth.js';

const router = express.Router();

//  bidders/register
router.post('/register', registerBidder);
router.post('/loginBidder', loginBidder);
router.post('/logout', logoutBidder);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

//bidders bid
router.post('/postBid', authenticateBidder, createBid);
router.get('/highest-bid', authenticateBidder, getHighestBid);

export default router;
