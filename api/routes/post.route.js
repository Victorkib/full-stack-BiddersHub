import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  addPost,
  deletePost,
  getPost,
  getsinglePostData,
  getPosts,
  updatePost,
  updateIsSoldStatus,
  getAllPosts,
} from '../controllers/post.controller.js';
import { authenticateBidder } from '../middleware/biddersAuth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/getAllPosts', getAllPosts);
router.get('/:id', getPost);
router.get('/getsinglePostData/:id', verifyToken, getsinglePostData);
router.post('/', verifyToken, addPost);
router.put('/:id', verifyToken, updatePost);
router.put('/updateIsSold/:id', authenticateBidder, updateIsSoldStatus);
router.delete('/:id', verifyToken, deletePost);

export default router;
