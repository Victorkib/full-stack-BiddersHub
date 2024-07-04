import express from 'express';
import {
  createSession,
  getCurrentValidSessions,
  userPostedData,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  getSummarizedPosts, // New
  getDetailedPost, // New
} from '../controllers/sessionController.js';
import auth from '../middleware/auth.js';

// addItemToSession,
// updateItemInSession,
// deleteItemFromSession,

const router = express.Router();

router.get('/', auth, getSessions);
router.get('/validEndtimeSessions', auth, getCurrentValidSessions);
router.get('/userPostedData', auth, userPostedData);
router.get('/:id', auth, getSession);
router.post('/', auth, createSession);
router.put('/:id', auth, updateSession);
router.delete('/:id', auth, deleteSession);

// // CRUD operations for items within a session
// router.post('/:id/items', auth, addItemToSession);
// router.put('/:id/items/:itemId', auth, updateItemInSession);
// router.delete('/:id/items/:itemId', auth, deleteItemFromSession);

// New routes for posts
router.get('/posts', auth, getSummarizedPosts);
router.get('/posts/:id', auth, getDetailedPost);

export default router;
