import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinaryConfig.js';

//get all posts
export const getPosts = async (req, res) => {
  const query = req.query;
  console.log('req.QueryInGetAllPosts: ' + query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        type: query.type || undefined,
        property: query.property || undefined,
        basePrice: {
          gte: parseInt(query.minBasePrice) || undefined,
          lte: parseInt(query.maxBasePrice) || undefined,
        },
      },
      include: { user: true },
    });

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get posts' });
  }
};
//get all the posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({});
    if (!posts) {
      throw new Error('Error fetching posts');
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get posts' });
  }
};

// Get single post
export const getPost = async (req, res) => {
  const id = req.params.id;
  console.log(`singlePostId: ` + id);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        } else {
          console.log('JWT verification error:', err);
        }
      });
    } else {
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get post' });
  }
};

export const getsinglePostData = async (req, res) => {
  const { id } = req.params;
  try {
    const singlePostData = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    if (!singlePostData) {
      return res.status(400).json({ message: 'Failed to get posts' });
    }
    console.log('singlPostData: ', singlePostData);
    res.status(200).json(singlePostData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to get posts' });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
};

//add post
export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  // Validate incoming data
  if (!postData || !postDetail) {
    return res
      .status(400)
      .json({ message: 'Post data and post details are required' });
  }
  console.log('postData', postData);
  console.log('postDetail', postDetail);

  try {
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Failed to create post', error: err.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: { id },
    });

    // Check if the user is authorized to update the post
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: 'Not Authorized!' });
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...body.postData,
        postDetail: {
          update: {
            ...body.postDetail,
          },
        },
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};
// Update post
export const updateIsSoldStatus = async (req, res) => {
  const id = req.params.id;
  // const tokenUserId = req.bidderId;

  try {
    // Find the post by ID
    const post = await prisma.post.findUnique({
      where: { id },
    });
    console.log('postToUpdate: ', post);
    // Check if the user is authorized to update the post
    if (!post) {
      return res
        .status(404)
        .json({ message: 'No such post to Update Sold Status!' });
    }

    // Check if there are any bids for the post
    const bids = await prisma.bid.findMany({
      where: { itemId: id },
    });

    // Determine the new isSold status based on the presence of bids
    const isSold = bids.length > 0;

    // Update the post
    const updatedIsSoldStatus = await prisma.post.update({
      where: { id },
      data: {
        isSold: isSold,
      },
      include: {
        postDetail: true,
      },
    });

    res.status(200).json(updatedIsSoldStatus);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update isSoldStatus of post' });
  }
};

//delete post;
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;

  try {
    await prisma.$transaction(
      async (prisma) => {
        // Find the post including all related data
        const post = await prisma.post.findUnique({
          where: { id: postId },
          include: {
            postDetail: true,
            savedPosts: true,
            sessions: {
              include: {
                session: {
                  include: {
                    items: true,
                  },
                },
              },
            },
          },
        });

        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        if (post.userId !== tokenUserId) {
          return res.status(403).json({ message: 'Not Authorized!' });
        }

        // Delete images from Cloudinary
        const deleteImages = post.images.map((imageUrl) => {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(publicId);
        });

        await Promise.all(deleteImages);

        // Delete associated SavedPost entries
        await prisma.savedPost.deleteMany({
          where: { postId },
        });

        // Delete the related PostDetail if it exists
        if (post.postDetail) {
          await prisma.postDetail.delete({
            where: { id: post.postDetail.id },
          });
        }

        // Delete related PostOnSession entries and Sessions
        for (const postOnSession of post.sessions) {
          // Delete the PostOnSession entry
          await prisma.postOnSession.delete({
            where: { id: postOnSession.id },
          });

          // Check if the session has any more related PostOnSession entries
          const remainingPostOnSession = await prisma.postOnSession.findFirst({
            where: { sessionId: postOnSession.sessionId },
          });

          // If no more related PostOnSession entries, delete the Session itself
          if (!remainingPostOnSession) {
            await prisma.session.delete({
              where: { id: postOnSession.sessionId },
            });
          }
        }

        // Now delete the Post itself
        await prisma.post.delete({ where: { id: postId } });
      },
      { timeout: 500000 } // Set a custom timeout of 10 seconds (10000 milliseconds)
    );

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
