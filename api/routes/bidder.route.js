import express from 'express';
import {
  registerBidder,
  loginBidder,
  logoutBidder,
  forgotPassword,
  resetPassword,
  bidderProfile,
  updateProfilePic,
} from '../controllers/bidder.controller.js';
import {
  createBid,
  getHighestBid,
  topFiveBidsOnItem,
  highestBidderOnItem,
  AllBidsOnItem,
  getBidsAndPostsByBidder,
} from '../controllers/bids.controller.js';
import { authenticateBidder } from '../middleware/biddersAuth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

//  bidders/register
router.post('/register', registerBidder);
router.post('/loginBidder', loginBidder);
router.get('/logout', logoutBidder);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/bidderProfile/:id', bidderProfile);
router.put('/updateProfilePic/:id', updateProfilePic);

//bidders bid
router.post('/postBid', authenticateBidder, createBid);
router.get('/highest-bid', authenticateBidder, getHighestBid);
router.get('/topFiveBidsOnItem', authenticateBidder, topFiveBidsOnItem);
router.get('/allBidsOnItem/:itemId', verifyToken, AllBidsOnItem);
router.get(
  '/getBidsAndPostsByBidder/:bidderId',
  authenticateBidder,
  getBidsAndPostsByBidder
);
router.get(
  '/highestBidderOnItem/:bidderId',
  authenticateBidder,
  highestBidderOnItem
);

export default router;
