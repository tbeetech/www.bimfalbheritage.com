const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const commentSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => randomUUID() },
    parentId: { type: String, default: null },
    userId: { type: String, default: null },
    author: { type: String, default: 'Guest' },
    text: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { _id: false }
);

const eventMetaSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    location: { type: String, default: '' },
    externalUrl: { type: String, default: '' },
    platform: { type: String, default: 'Facebook Events' },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    title: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    authorName: { type: String, default: '' },
    body: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    category: { type: String, default: 'Culture' },
    contentType: { type: String, default: 'blog' },
    collaborationPartner: { type: String, default: '' },
    collaborationType: { type: String, default: '' },
    sharePlatforms: { type: String, default: '' },
    tags: { type: String, default: '' },
    eventMeta: { type: eventMetaSchema, default: () => ({}) },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
    shares: { type: Number, default: 0 },
    comments: { type: [commentSchema], default: [] },
    publishDate: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Post', postSchema);
