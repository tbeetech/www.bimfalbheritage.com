const express = require('express');
const rateLimit = require('express-rate-limit');
const { getGalleryItems, createGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { adminGuard } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');
const { compressImages } = upload;

const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many admin requests, please slow down' },
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down' },
});

router.get('/', readLimiter, getGalleryItems);
router.post('/', adminLimiter, adminGuard, upload.array('images', 1), compressImages, createGalleryItem);
router.delete('/:id', adminLimiter, adminGuard, deleteGalleryItem);

module.exports = router;
