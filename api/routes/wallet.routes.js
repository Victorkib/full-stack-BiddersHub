// routes/wallet.js

import express from 'express';
import {
  createWallet,
  creditWallet,
  debitWallet,
  getWalletDetails,
  getWalletBalance,
} from '../controllers/walletController.js';

const router = express.Router();

// Create wallet for a bidder
router.post('/create', async (req, res) => {
  const { bidderId } = req.body;
  try {
    const wallet = await createWallet(bidderId);
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Error creating wallet:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Credit funds to bidder's wallet
router.post('/credit', async (req, res) => {
  const { walletId, amount, description } = req.body;
  try {
    const wallet = await creditWallet(walletId, amount, description);
    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error crediting wallet:', error);
    res.status(500).json({ error: 'Failed to credit wallet' });
  }
});

// Debit funds from bidder's wallet
router.post('/debit', async (req, res) => {
  const { walletId, amount, description } = req.body;
  try {
    const wallet = await debitWallet(walletId, amount, description);
    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error debiting wallet:', error);
    res.status(500).json({ error: 'Failed to debit wallet' });
  }
});

// Get wallet details for a bidder
router.get('/details/:bidderId', async (req, res) => {
  const { bidderId } = req.params;
  try {
    const wallet = await getWalletDetails(bidderId);
    console.log('wallet: ', wallet);
    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    res.status(500).json({ error: 'Failed to fetch wallet details' });
  }
});

// Get wallet balance for a bidder
router.get('/balance/:bidderId', async (req, res) => {
  const { bidderId } = req.params;
  try {
    const balance = await getWalletBalance(bidderId);
    res.status(200).json(balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { walletId, amount, type, description } = req.body;
    const transaction = await recordTransaction(
      walletId,
      amount,
      type,
      description
    );
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});

export default router;
