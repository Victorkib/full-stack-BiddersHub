import prisma from '../lib/prisma.js';
import moment from 'moment';

//create sesssion
export const createSession = async (req, res) => {
  const { title, description, startTime, endTime, selectedPosts } = req.body;
  try {
    const session = await prisma.session.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdById: req.userId,
        isActive: false,
        posts: {
          create: selectedPosts.map((postId) => ({ postId })),
        },
      },
    });
    //console.log('created session: ' + session);
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all sessions ever created by the current authenticated user
export const getSessions = async (req, res) => {
  // Subtract 3 hours from the current time
  const currentDate = new Date();
  console.log('currentDate: ', currentDate);
  const currentDateTime = moment().add(3, 'hours').toDate();
  console.log('currentDateTime: ', currentDateTime);

  try {
    const sessions = await prisma.session.findMany({
      where: {
        createdById: req.userId,
        endTime: {
          lt: currentDateTime,
        },
      },
      orderBy: { startTime: 'desc' },
      include: {
        createdBy: true,
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    console.log('endedSessions: ', sessions);
    const sessionsWithoutPassword = sessions.map((session) => ({
      ...session,
      createdBy: {
        ...session.createdBy,
        password: undefined,
      },
    }));
    console.log('pastSessions: ', sessionsWithoutPassword);
    res.status(200).json(sessionsWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if item is in current session
export const isItemInActiveSession = async (req, res) => {
  const currentDate = new Date();
  console.log('currentDate: ', currentDate);
  const currentDateTime = moment().add(3, 'hours').toDate();
  console.log('currentDateTime: ', currentDateTime);

  try {
    const sessions = await prisma.session.findMany({
      where: {
        endTime: {
          gt: currentDateTime,
        },
        posts: {
          some: {
            postId: req.params.id,
          },
        },
      },
    });

    console.log(sessions);

    if (sessions && sessions.length > 0) {
      res.status(200).json({ sessions, value: true });
    } else {
      res.status(200).json({ value: false });
    }
  } catch (error) {
    console.error('Error checking if item is in active session:', error);
    res.status(500).json({ error: 'Failed to fetch active sessions' });
  }
};
// Get sessions for current authenticated user that have valid endtime
export const getCurrentValidSessions = async (req, res) => {
  const currentDateTime = new Date();
  try {
    const sessions = await prisma.session.findMany({
      where: {
        createdById: req.userId,
        endTime: {
          gt: currentDateTime,
        },
      },
      include: {
        createdBy: true,
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    const sessionsWithPostImages = sessions.map((session) => ({
      ...session,
      postImages: session.posts.map((post) => post.post.images[0]),
      createdBy: {
        ...session.createdBy,
        password: undefined,
      },
    }));

    res.status(200).json(sessionsWithPostImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all sessions
export const validEndtimeSessionsBidders = async (req, res) => {
  const currentDate = new Date();
  console.log('currentDate: ', currentDate);
  const currentDateTime = moment().add(3, 'hours').toDate();
  console.log('currentDateTime: ', currentDateTime);

  try {
    const sessions = await prisma.session.findMany({
      where: {
        endTime: {
          gt: currentDateTime,
        },
      },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
    console.log('sessions', sessions);
    const sessionsWithPostImages = sessions.map((session) => ({
      ...session,
      postImages: session.posts.map((post) => post.post.images[0]),
    }));
    console.log('sessionsWithPostImages: ', sessionsWithPostImages);
    res.status(200).json(sessionsWithPostImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get posted data for selection in creating session
export const userPostedData = async (req, res) => {
  try {
    const postedData = await prisma.post.findMany({
      where: {
        userId: req.userId,
      },
    });

    console.log('postedData: ', postedData);
    // Extract post IDs
    const postIds = postedData.map((post) => post.id);

    // Get the current time
    // const currentTime = new Date();
    const currentDate = new Date();
    console.log('currentDate: ', currentDate);
    const currentDateTime = moment().add(3, 'hours').toDate();
    console.log('currentDateTime: ', currentDateTime);

    // Find all sessions with posts and check active status
    const activeSessions = await prisma.session.findMany({
      where: {
        endTime: {
          gt: currentDateTime, // Session endTime greater than current time
        },
      },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
    console.log('activeSessions: ', activeSessions);

    // Collect all post IDs that are in active sessions
    const activePostIds = new Set();
    activeSessions.forEach((session) => {
      session.posts.forEach((postItem) => {
        if (postIds.includes(postItem.post.id)) {
          activePostIds.add(postItem.post.id);
        }
      });
    });

    // Filter out posts that are in active sessions
    const availablePosts = postedData.filter(
      (post) => !activePostIds.has(post.id)
    );
    console.log('availablePosts: ', availablePosts);
    res.status(200).json(availablePosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get summarized post data
export const getSummarizedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        basePrice: true,
        images: true,
      },
    });

    const summarizedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      basePrice: post.basePrice,
      image: post.images[0], // Assuming images is an array
    }));

    res.status(200).json(summarizedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get detailed post data by ID
export const getDetailedPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        postDetail: true,
        user: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific session by ID
export const getSession = async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: true,
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    console.log('session: ', session);
    session.createdBy.password = undefined;

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a specific session by ID
export const updateSession = async (req, res) => {
  const { title, description, startTime, endTime, selectedPosts } = req.body;
  try {
    // Delete existing post relations
    await prisma.postOnSession.deleteMany({
      where: {
        sessionId: req.params.id,
      },
    });

    // Update the session and create new post relations
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        posts: {
          create: selectedPosts.map((postId) => ({ postId })),
        },
      },
    });
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// function to speed up session  essentially ending the session
export const speedUpSession = async (req, res) => {
  const { id } = req.params;

  const currentDate = new Date();
  console.log('currentDate: ', currentDate);
  const currentDateTime = moment().add(3, 'hours').toDate(); // Adjust for timezone
  console.log('currentDateTime: ', currentDateTime);

  try {
    const session = await prisma.session.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
    console.log('sessionToSpeedUp: ', session);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    for (const sessionPost of session.posts) {
      const postId = sessionPost.post.id;

      const bids = await prisma.bid.findMany({
        where: {
          itemId: postId,
        },
      });

      const isSold = bids.length > 0;

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          isSold: isSold,
        },
      });
    }

    // Update the session's endTime
    const updatedSession = await prisma.session.update({
      where: {
        id: id,
      },
      data: {
        endTime: currentDateTime,
      },
    });

    return res.status(200).json(updatedSession);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// function to update IsSold Status
export const updateIsSoldStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await prisma.session.findUnique({
      where: {
        id: id,
      },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });

    console.log('sessionWithPostToUpdateIsSold: ', session);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    let updatedPosts = [];

    for (const sessionPost of session.posts) {
      const postId = sessionPost.post.id;

      const bids = await prisma.bid.findMany({
        where: {
          itemId: postId,
        },
      });

      const isSold = bids.length > 0;

      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          isSold: isSold,
        },
      });

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      updatedPosts.push(updatedPost);
    }

    return res
      .status(200)
      .json({ message: 'Posts updated successfully', updatedPosts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a specific session by ID
export const deleteSession = async (req, res) => {
  try {
    // Delete related PostOnSession entries first
    await prisma.postOnSession.deleteMany({
      where: { sessionId: req.params.id },
    });

    // Then delete the session
    await prisma.session.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: 'Session and related data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
