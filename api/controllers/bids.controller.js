// controllers/bidder.controller.js

import prisma from '../lib/prisma.js';
import { sendVerificationEmail } from '../utils/congratsEmail.js';

// Controller to make a bid on a post/item
// export const createBid = async (req, res) => {
//   const { amount, itemId } = req.body;
//   const bidderId = req.bidderId;

//   try {
//     // Check if bidder already has a bid on this item
//     const existingBid = await prisma.bid.findFirst({
//       where: {
//         itemId,
//         bidderId,
//       },
//     });

//     if (existingBid) {
//       // Update existing bid
//       const updatedBid = await prisma.bid.update({
//         where: {
//           id: existingBid.id,
//         },
//         data: {
//           amount: parseFloat(amount),
//         },
//         include: {
//           bidder: {
//             select: {
//               id: true,
//               email: true,
//               username: true,
//             },
//           },
//         },
//       });
//       console.log('updatedBid: ', updatedBid);
//       res.status(200).json(updatedBid);
//     } else {
//       // Create new bid
//       const newBid = await prisma.bid.create({
//         data: {
//           itemId,
//           amount: parseFloat(amount),
//           bidder: {
//             connect: { id: bidderId },
//           },
//         },
//         include: {
//           bidder: {
//             select: {
//               id: true,
//               email: true,
//               username: true,
//             },
//           },
//         },
//       });
//       console.log('newBid: ', newBid);
//       res.status(201).json(newBid);
//     }
//   } catch (error) {
//     console.error('Error making bid:', error);
//     res.status(500).json({ error: 'Failed to make bid' });
//   }
// };

// Controller to make a bid on a post/item
export const createBid = async (req, res) => {
  const { amount, itemId } = req.body;
  const bidderId = req.bidderId;

  try {
    // Create new bid
    const newBid = await prisma.bid.create({
      data: {
        itemId,
        amount: parseFloat(amount),
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

    console.log(newBid);
    // Also create a historical bid
    const newHistoricalBid = await prisma.historicalBid.create({
      data: {
        itemId,
        amount: parseFloat(amount),
        bidder: {
          connect: { id: bidderId },
        },
      },
    });

    console.log('newBid: ', newBid);
    console.log('newHistoricalBid: ', newHistoricalBid);
    res.status(201).json(newBid);
  } catch (error) {
    console.error('Error making bid:', error);
    res.status(500).json({ message: 'Failed to make bid.' });
  }
};

// Controller to retrieve bid history for a specific item
export const getBidHistory = async (req, res) => {
  const { itemId } = req.params;

  try {
    // Retrieve all historical bids for the specified item
    const bidHistory = await prisma.historicalBid.findMany({
      where: {
        itemId: itemId,
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.status(200).json(bidHistory);
  } catch (error) {
    console.error('Error retrieving bid history:', error);
    res.status(500).json({ message: 'Failed to retrieve bid history.' });
  }
};

// Controller to get the highest bid for a post/item
export const getHighestBid = async (req, res) => {
  const { itemId } = req.query;
  try {
    // Fetch highest bid for the item and image URL including the bidder information
    const highestBid = await prisma.bid.findFirst({
      where: {
        itemId: itemId,
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
    console.log('highestBid: ', highestBid);
    res.status(200).json(highestBid);
  } catch (error) {
    console.error('Error fetching highest bid:', error);
    res.status(500).json({ error: 'Failed to fetch highest bid' });
  }
};

//get top 5 highest bids and bidders
export const topFiveBidsOnItem = async (req, res) => {
  const { itemId } = req.query;

  try {
    const topFiveBids = await prisma.bid.findMany({
      where: { itemId },
      include: {
        bidder: { select: { id: true, username: true, email: true } },
      }, // Include bidder information (optional)
      orderBy: { amount: 'desc' }, // Order bids by amount (highest first)
      take: 5, // Limit results to top 5 bids
    });

    res.status(200).json(topFiveBids);
  } catch (error) {
    console.error('Error fetching top 5 bids:', error);
    res.status(500).json({ error: 'Failed to fetch top 5 bids' });
  }
};

//get all bids and bidders on item
export const AllBidsOnItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const allBidValueOnItem = await prisma.bid.findMany({
      where: { itemId },
      include: {
        bidder: {
          select: { id: true, username: true, email: true, profile: true },
        },
      }, // Include bidder information (optional)
      orderBy: { amount: 'desc' }, // Order bids by amount (highest first)
    });

    res.status(200).json(allBidValueOnItem);
  } catch (error) {
    console.error('Error fetching top 5 bids:', error);
    res.status(500).json({ error: 'Failed to fetch top 5 bids' });
  }
};

//get all bids and bidders on item
// Controller to retrieve bids and posts by bidder including historical bids
export const getBidsAndPostsByBidder = async (req, res) => {
  try {
    const { bidderId } = req.params;

    // Step 1: Find all current bids by the bidder
    const bids = await prisma.bid.findMany({
      where: {
        bidderId: bidderId,
      },
    });

    // Extract itemIds from bids
    const itemIds = bids.map((bid) => bid.itemId);

    // Step 2: Find all posts with ids in itemIds
    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
    });

    // Step 3: Find all historical bids for these items
    const historicalBids = await prisma.historicalBid.findMany({
      where: {
        itemId: {
          in: itemIds,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Send response
    console.log('bids: ', bids);
    console.log('posts: ', posts);
    console.log('historicalBids: ', historicalBids);

    res.json({ bids, posts, historicalBids });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching bids and posts.' });
  }
};

export const highestBidderOnItem = async (req, res) => {
  const { bidderId } = req.params;
  const { email } = req.query;
  const currentDate = new Date();

  try {
    // Fetch past sessions with their posts
    const pastSessions = await prisma.session.findMany({
      where: {
        endTime: {
          lt: currentDate,
        },
      },
      orderBy: { startTime: 'desc' },
      include: {
        posts: {
          where: {
            post: {
              isSold: true,
            },
          },
          include: {
            post: {
              select: { id: true, title: true, basePrice: true, images: true },
            },
          },
        },
      },
    });
    console.log('pastSessions:', pastSessions);

    // Collect post IDs for querying highest bids
    const postIds = pastSessions.flatMap((session) =>
      session.posts.map((postOnSession) => postOnSession.post.id)
    );

    // Fetch highest bids for all relevant posts
    const highestBids = await prisma.historicalBid.findMany({
      where: { itemId: { in: postIds } },
      orderBy: { amount: 'desc' },
      include: { bidder: true },
    });

    // Create a map of highest bids by postId
    const highestBidMap = highestBids.reduce((map, bid) => {
      if (!map[bid.itemId] || bid.amount > map[bid.itemId].amount) {
        map[bid.itemId] = bid;
      }
      return map;
    }, {});

    // Prepare a list to collect posts where the bidder is the highest bidder
    const postsWhereBidderIsHighest = [];

    // Iterate through each session
    for (const session of pastSessions) {
      // Iterate through each post in the session
      for (const postOnSession of session.posts) {
        const postId = postOnSession.post.id;
        const highestBid = highestBidMap[postId];

        if (highestBid && highestBid.bidderId === bidderId) {
          // Add the post to the result
          postsWhereBidderIsHighest.push({
            highestBid,
            post: postOnSession.post,
          });
        }
      }
    }

    // Handle case where no winning bids are found
    if (postsWhereBidderIsHighest.length === 0) {
      return res.json({
        message: 'No winning bids found for this bidder',
        pastSessions,
      });
    }
    const user = postsWhereBidderIsHighest[0].highestBid.bidder;
    console.log('user: ', user);

    const emailResult = await sendVerificationEmail(user);

    console.log('results of SendEMail: ' + emailResult.emailMessage);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: emailResult.error,
        // emailMessage: emailResult.emailMessage,
      });
    }

    res.status(200).json(postsWhereBidderIsHighest);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Failed to retrieve bid information' });
  }
};
