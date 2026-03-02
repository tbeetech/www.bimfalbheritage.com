const express = require('express');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
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

module.exports = router;
