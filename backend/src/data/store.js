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
      userId: c.userId || null,
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
    userId: payload.userId || null,
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

const incrementView = async (id) => {
  const post = await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean();
  if (!post) return null;
  return { views: post.views };
};

const toggleLike = async (id, userId) => {
  const post = await Post.findById(id).lean();
  if (!post) return null;

  const likes = Array.isArray(post.likes) ? post.likes : [];
  const alreadyLiked = likes.includes(userId);

  const update = alreadyLiked
    ? { $pull: { likes: userId } }
    : { $addToSet: { likes: userId } };

  const updated = await Post.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!updated) return null;
  return { likes: updated.likes.length, liked: !alreadyLiked };
};

const incrementShare = async (id) => {
  const post = await Post.findByIdAndUpdate(id, { $inc: { shares: 1 } }, { new: true }).lean();
  if (!post) return null;
  return { shares: post.shares };
};

const deleteComment = async (postId, commentId, userId) => {
  // Fetch the post to verify comment ownership
  const post = await Post.findById(postId).lean();
  if (!post) return null;
  const comment = post.comments.find((c) => c.id === commentId);
  if (!comment) return null;
  // Only the comment author (by userId) or any admin can delete
  if (comment.userId && comment.userId !== userId) return false;

  await Post.findByIdAndUpdate(postId, { $pull: { comments: { id: commentId } } });
  return true;
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
  incrementView,
  toggleLike,
  incrementShare,
  deleteComment,
};
