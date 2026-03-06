const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reactToPost,
  getComments,
  addComment,
  reactToComment,
  incrementView,
  toggleLike,
  incrementShare,
  deleteOwnComment,
} = require('../controllers/postController');
const { adminGuard } = require('../middleware/authMiddleware');
const { userGuard, optionalUserAuth } = require('../middleware/userAuthMiddleware');
const upload = require('../utils/upload');
const { compressImages, firebaseUpload } = upload;

const router = express.Router();

/** Moderate limiter for interaction endpoints: 60 per minute per IP */
const interactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down' },
});

/** Admin CRUD limiter: 30 requests per 15 minutes per IP */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many admin requests, please slow down' },
});

router.route('/')
  .get(getPosts)
  .post(adminLimiter, adminGuard, upload.array('images', 3), compressImages, firebaseUpload, createPost);

router.route('/:id')
  .get(getPost)
  .put(adminLimiter, adminGuard, upload.array('images', 3), compressImages, firebaseUpload, updatePost)
  .delete(adminLimiter, adminGuard, deletePost);

router.post('/:id/reactions', interactionLimiter, reactToPost);
router.post('/:id/view', interactionLimiter, incrementView);
router.post('/:id/like', interactionLimiter, optionalUserAuth, toggleLike);
router.post('/:id/share', interactionLimiter, incrementShare);

router.route('/:id/comments')
  .get(getComments)
  .post(interactionLimiter, optionalUserAuth, addComment);
router.post('/:id/comments/:commentId/reactions', interactionLimiter, reactToComment);
router.delete('/:id/comments/:commentId', interactionLimiter, userGuard, deleteOwnComment);

module.exports = router;
