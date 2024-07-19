import prisma from '../lib/prisma.js';

// Create wallet for a new bidder
export const createWallet = async (bidderId) => {
  try {
    const wallet = await prisma.wallet.create({
      data: {
        balance: 0,
        bidder: { connect: { id: bidderId } },
      },
    });
    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
};

// Credit funds to bidder's wallet
export const creditWallet = async (walletId, amount, description) => {
  console.log('description: ', description);
  try {
    // Check if wallet exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: { bidder: true },
    });
    console.log('existingWalletDetails: ', existingWallet);
    if (!existingWallet) {
      throw new Error(`Wallet with ID ${walletId} does not exist`);
    }

    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: amount },
        transactions: {
          create: {
            amount,
            type: 'credit',
            description,
          },
        },
      },
      include: { transactions: true },
    });
    console.log('newWalletDetails: ', wallet);
    return wallet;
  } catch (error) {
    console.error('Error crediting wallet:', error);
    throw new Error('Failed to credit wallet');
  }
};

// Debit funds from bidder's wallet
export const debitWallet = async (walletId, amount, description) => {
  try {
    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            amount,
            type: 'debit',
            description,
          },
        },
      },
      include: { transactions: true },
    });

    return wallet;
  } catch (error) {
    console.error('Error debiting wallet:', error);
    throw new Error('Failed to debit wallet');
  }
};

// Get wallet details for a bidder
export const getWalletDetails = async (bidderId) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { bidderId },
      include: { transactions: true },
    });

    return wallet;
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    throw new Error('Failed to fetch wallet details');
  }
};

// Get wallet balance for a bidder
export const getWalletBalance = async (bidderId) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { bidderId },
      select: { balance: true },
    });

    return wallet;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw new Error('Failed to fetch wallet balance');
  }
};

// Record a transaction for a wallet
export const recordTransaction = async (
  walletId,
  amount,
  type,
  description
) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description,
        wallet: { connect: { id: walletId } },
      },
    });

    return transaction;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw new Error('Failed to record transaction');
  }
};
