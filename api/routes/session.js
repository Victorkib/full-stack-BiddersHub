import express from 'express';
import {
  createSession,
  getCurrentValidSessions,
  userPostedData,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  speedUpSession,
  updateIsSoldStatus,
  validEndtimeSessionsBidders,
  getSummarizedPosts, // New
  getDetailedPost, // New
  isItemInActiveSession,
} from '../controllers/sessionController.js';
import auth from '../middleware/auth.js';
import { authenticateBidder } from '../middleware/biddersAuth.js';

// addItemToSession,
// updateItemInSession,
// deleteItemFromSession,

const router = express.Router();

router.get('/', auth, getSessions);
router.get('/validEndtimeSessions', auth, getCurrentValidSessions);
router.get(
  '/validEndtimeSessionsBidders',
  authenticateBidder,
  validEndtimeSessionsBidders
);
router.get('/userPostedData', auth, userPostedData);
router.get('/:id', auth, getSession);
router.get('/isItemInActiveSession/:id', auth, isItemInActiveSession);
router.get('/indiSessBidders/:id', authenticateBidder, getSession);
router.post('/', auth, createSession);
router.put('/:id', auth, updateSession);
router.delete('/:id', auth, deleteSession);
router.put('/speedUpSession/:id', auth, speedUpSession);
router.put('/updateIsSoldStatus/:id', auth, updateIsSoldStatus);

// // CRUD operations for items within a session
// router.post('/:id/items', auth, addItemToSession);
// router.put('/:id/items/:itemId', auth, updateItemInSession);
// router.delete('/:id/items/:itemId', auth, deleteItemFromSession);

// New routes for posts
router.get('/posts', auth, getSummarizedPosts);
router.get('/posts/:id', auth, getDetailedPost);

export default router;
