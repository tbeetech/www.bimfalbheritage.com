const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const seedPosts = require('../seed/data/posts');

const DATA_FILE = path.join(__dirname, 'posts.json');

const normalizePost = (post) => ({
  _id: post._id || randomUUID(),
  title: post.title || '',
  excerpt: post.excerpt || '',
  authorName: post.authorName || '',
  body: post.body || '',
  coverImage: post.coverImage || '',
  videoUrl: post.videoUrl || '',
  category: post.category || 'Culture',
  contentType: post.contentType || 'blog',
  collaborationPartner: post.collaborationPartner || '',
  collaborationType: post.collaborationType || '',
  sharePlatforms: post.sharePlatforms || '',
  tags: post.tags || '',
  eventMeta: {
    title: post.eventMeta?.title || '',
    startDate: post.eventMeta?.startDate || '',
    endDate: post.eventMeta?.endDate || '',
    location: post.eventMeta?.location || '',
    externalUrl: post.eventMeta?.externalUrl || '',
    platform: post.eventMeta?.platform || 'Facebook Events',
  },
  upvotes: Number(post.upvotes || 0),
  downvotes: Number(post.downvotes || 0),
  comments: Array.isArray(post.comments)
    ? post.comments.map((comment) => ({
      id: comment.id || randomUUID(),
      parentId: comment.parentId || null,
      author: comment.author || 'Guest',
      text: comment.text || '',
      createdAt: comment.createdAt || new Date().toISOString(),
      upvotes: Number(comment.upvotes || 0),
      downvotes: Number(comment.downvotes || 0),
    }))
    : [],
  publishDate: post.publishDate || new Date().toISOString(),
});

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedPosts.map(normalizePost), null, 2));
  }
};

const load = () => {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw).map(normalizePost);
};

let cache = load();

const persist = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2));
};

const getAll = () => cache;

const getById = (id) => cache.find((p) => p._id === id);

const add = (payload) => {
  const item = normalizePost({
    _id: randomUUID(),
    publishDate: payload.publishDate || new Date().toISOString(),
    ...payload,
  });
  cache = [item, ...cache];
  persist();
  return item;
};

const update = (id, payload) => {
  const idx = cache.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  cache[idx] = normalizePost({ ...cache[idx], ...payload });
  persist();
  return cache[idx];
};

const remove = (id) => {
  const exists = getById(id);
  cache = cache.filter((p) => p._id !== id);
  persist();
  return exists;
};

const reactToPost = (id, type) => {
  const idx = cache.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  if (type === 'up') cache[idx].upvotes += 1;
  if (type === 'down') cache[idx].downvotes += 1;
  persist();
  return {
    upvotes: cache[idx].upvotes,
    downvotes: cache[idx].downvotes,
    score: cache[idx].upvotes - cache[idx].downvotes,
  };
};

const getComments = (id) => {
  const post = getById(id);
  if (!post) return null;
  return post.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

const addComment = (id, payload) => {
  const idx = cache.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  const comment = {
    id: randomUUID(),
    parentId: payload.parentId || null,
    author: payload.author || 'Guest',
    text: payload.text || '',
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };
  cache[idx].comments.push(comment);
  persist();
  return comment;
};

const reactToComment = (postId, commentId, type) => {
  const postIdx = cache.findIndex((p) => p._id === postId);
  if (postIdx === -1) return null;
  const commentIdx = cache[postIdx].comments.findIndex((c) => c.id === commentId);
  if (commentIdx === -1) return null;
  if (type === 'up') cache[postIdx].comments[commentIdx].upvotes += 1;
  if (type === 'down') cache[postIdx].comments[commentIdx].downvotes += 1;
  persist();
  return cache[postIdx].comments[commentIdx];
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
