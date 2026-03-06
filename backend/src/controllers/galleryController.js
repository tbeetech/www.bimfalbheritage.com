const mongoose = require('mongoose');
const GalleryItem = require('../models/Gallery');
const { bufferToDataUrl } = require('../utils/upload');

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
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) {
      res.status(400);
      throw new Error('At least one image is required');
    }

    const caption = req.body.caption || '';
    const items = await Promise.all(
      files.map((file) =>
        new GalleryItem({ imageUrl: bufferToDataUrl(file), caption }).save()
      )
    );

    res.status(201).json(items.length === 1 ? items[0].toObject() : items.map((i) => i.toObject()));
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
