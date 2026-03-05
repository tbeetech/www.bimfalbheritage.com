const express = require('express');
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

router.route('/')
  .get(getPosts)
  .post(adminGuard, upload.array('images', 3), compressImages, firebaseUpload, createPost);

router.route('/:id')
  .get(getPost)
  .put(adminGuard, upload.array('images', 3), compressImages, firebaseUpload, updatePost)
  .delete(adminGuard, deletePost);

router.post('/:id/reactions', reactToPost);
router.post('/:id/view', incrementView);
router.post('/:id/like', optionalUserAuth, toggleLike);
router.post('/:id/share', incrementShare);

router.route('/:id/comments')
  .get(getComments)
  .post(optionalUserAuth, addComment);
router.post('/:id/comments/:commentId/reactions', reactToComment);
router.delete('/:id/comments/:commentId', userGuard, deleteOwnComment);

module.exports = router;
