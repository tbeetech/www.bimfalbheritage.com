const Post = require('../models/Post');
const { randomUUID } = require('crypto');

const getAll = async () => {
  return Post.find().lean();
};

const getById = async (id) => {
  return Post.findById(id).lean();
};

const add = async (payload) => {
  const post = new Post({
    _id: randomUUID(),
    publishDate: payload.publishDate || new Date().toISOString(),
    ...payload,
  });
  await post.save();
  return post.toObject();
};

const update = async (id, payload) => {
  const updated = await Post.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: false }
  ).lean();
  return updated || null;
};

const remove = async (id) => {
  const post = await Post.findByIdAndDelete(id).lean();
  return post || null;
};

const reactToPost = async (id, type) => {
  const inc = type === 'up' ? { upvotes: 1 } : { downvotes: 1 };
  const post = await Post.findByIdAndUpdate(id, { $inc: inc }, { new: true }).lean();
  if (!post) return null;
  const { upvotes, downvotes } = post;
  return { upvotes, downvotes, score: upvotes - downvotes };
};

const getComments = async (id) => {
  const post = await Post.findById(id).lean();
  if (!post) return null;
  const comments = Array.isArray(post.comments) ? post.comments : [];
  return comments
    .map((c) => ({
      id: c.id || randomUUID(),
      parentId: c.parentId || null,
      author: c.author || 'Guest',
      text: c.text || '',
      createdAt: c.createdAt || new Date().toISOString(),
      upvotes: Number(c.upvotes || 0),
      downvotes: Number(c.downvotes || 0),
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

const addComment = async (id, payload) => {
  const comment = {
    id: randomUUID(),
    parentId: payload.parentId || null,
    author: payload.author || 'Guest',
    text: payload.text || '',
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };
  const post = await Post.findByIdAndUpdate(
    id,
    { $push: { comments: comment } },
    { new: true }
  ).lean();
  if (!post) return null;
  return comment;
};

const reactToComment = async (postId, commentId, type) => {
  const inc = type === 'up'
    ? { 'comments.$[c].upvotes': 1 }
    : { 'comments.$[c].downvotes': 1 };
  const post = await Post.findByIdAndUpdate(
    postId,
    { $inc: inc },
    { arrayFilters: [{ 'c.id': commentId }], new: true }
  ).lean();
  if (!post) return null;
  const comment = post.comments.find((c) => c.id === commentId);
  return comment || null;
};

module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
  reactToPost,
  getComments,
  addComment,
  reactToComment,
};
