const mongoose = require('mongoose');
const GalleryItem = require('../models/Gallery');

const getGalleryItems = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const createGalleryItem = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  try {
    const imageUrl =
      (Array.isArray(req.files) && req.files.length > 0)
        ? `/uploads/${req.files[0].filename}`
        : (req.body.imageUrl || '');

    if (!imageUrl) {
      res.status(400);
      throw new Error('An image is required');
    }

    const item = new GalleryItem({
      imageUrl,
      caption: req.body.caption || '',
    });
    await item.save();
    res.status(201).json(item.toObject());
  } catch (err) {
    next(err);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database not connected' });
  }
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id).lean();
    if (!item) {
      res.status(404);
      throw new Error('Gallery item not found');
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGalleryItems, createGalleryItem, deleteGalleryItem };
