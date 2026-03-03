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
} = require('../controllers/postController');
const { adminGuard } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(adminGuard, upload.single('coverImage'), createPost);

router.route('/:id')
  .get(getPost)
  .put(adminGuard, upload.single('coverImage'), updatePost)
  .delete(adminGuard, deletePost);

router.post('/:id/reactions', reactToPost);
router.route('/:id/comments')
  .get(getComments)
  .post(addComment);
router.post('/:id/comments/:commentId/reactions', reactToComment);

module.exports = router;
