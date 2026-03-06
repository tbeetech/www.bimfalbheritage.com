const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const galleryItemSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false }
);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
