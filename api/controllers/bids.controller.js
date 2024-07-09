// controllers/bidder.controller.js

import prisma from '../lib/prisma.js';

// Controller to make a bid on a post/item
export const createBid = async (req, res) => {
  const { amount, itemId, itemImage } = req.body;
  const bidderId = req.bidderId;

  try {
    // Check if bidder already has a bid on this item
    const existingBid = await prisma.bid.findFirst({
      where: {
        itemId,
        bidderId,
      },
    });

    if (existingBid) {
      // Update existing bid
      const updatedBid = await prisma.bid.update({
        where: {
          id: existingBid.id,
        },
        data: {
          amount: parseFloat(amount),
          itemImage,
        },
        include: {
          bidder: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });

      res.status(200).json(updatedBid);
    } else {
      // Create new bid
      const newBid = await prisma.bid.create({
        data: {
          itemId,
          amount: parseFloat(amount),
          itemImage,
          bidder: {
            connect: { id: bidderId },
          },
        },
        include: {
          bidder: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });

      res.status(201).json(newBid);
    }
  } catch (error) {
    console.error('Error making bid:', error);
    res.status(500).json({ error: 'Failed to make bid' });
  }
};

// Controller to get the highest bid for a post/item
export const getHighestBid = async (req, res) => {
  const { itemId, img } = req.query;
  try {
    // Fetch highest bid for the item and image URL including the bidder information
    const highestBid = await prisma.bid.findFirst({
      where: {
        itemId: itemId,
        itemImage: img,
      },
      orderBy: {
        amount: 'desc',
      },
      include: {
        bidder: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json(highestBid);
  } catch (error) {
    console.error('Error fetching highest bid:', error);
    res.status(500).json({ error: 'Failed to fetch highest bid' });
  }
};
