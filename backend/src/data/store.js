const { db } = require('../config/firebase');
const { randomUUID } = require('crypto');

const COLLECTION = 'posts';

const normalizePost = (post) => ({
  _id: post._id || randomUUID(),
  title: post.title || '',
  excerpt: post.excerpt || '',
  authorName: post.authorName || '',
  body: post.body || '',
  coverImage: post.coverImage || '',
  images: Array.isArray(post.images) ? post.images : (post.coverImage ? [post.coverImage] : []),
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
  publishDate: post.publishDate instanceof Date
    ? post.publishDate.toISOString()
    : (post.publishDate || new Date().toISOString()),
});

const docToPost = (doc) => normalizePost({ _id: doc.id, ...doc.data() });

const getAll = async () => {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map(docToPost);
};

const getById = async (id) => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return docToPost(doc);
};

const add = async (payload) => {
  const id = randomUUID();
  const item = normalizePost({
    _id: id,
    publishDate: payload.publishDate || new Date().toISOString(),
    ...payload,
  });
  await db.collection(COLLECTION).doc(id).set(item);
  return item;
};

const update = async (id, payload) => {
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const updated = normalizePost({ ...doc.data(), _id: id, ...payload });
  await ref.set(updated);
  return updated;
};

const remove = async (id) => {
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const item = docToPost(doc);
  await ref.delete();
  return item;
};

const reactToPost = async (id, type) => {
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const data = doc.data();
  const upvotes = Number(data.upvotes || 0) + (type === 'up' ? 1 : 0);
  const downvotes = Number(data.downvotes || 0) + (type === 'down' ? 1 : 0);
  await ref.update({ upvotes, downvotes });
  return { upvotes, downvotes, score: upvotes - downvotes };
};

const getComments = async (id) => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  const comments = Array.isArray(doc.data().comments) ? doc.data().comments : [];
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
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const comments = Array.isArray(doc.data().comments) ? doc.data().comments : [];
  const comment = {
    id: randomUUID(),
    parentId: payload.parentId || null,
    author: payload.author || 'Guest',
    text: payload.text || '',
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };
  comments.push(comment);
  await ref.update({ comments });
  return comment;
};

const reactToComment = async (postId, commentId, type) => {
  const ref = db.collection(COLLECTION).doc(postId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const comments = Array.isArray(doc.data().comments) ? [...doc.data().comments] : [];
  const idx = comments.findIndex((c) => c.id === commentId);
  if (idx === -1) return null;
  if (type === 'up') comments[idx] = { ...comments[idx], upvotes: Number(comments[idx].upvotes || 0) + 1 };
  if (type === 'down') comments[idx] = { ...comments[idx], downvotes: Number(comments[idx].downvotes || 0) + 1 };
  await ref.update({ comments });
  return comments[idx];
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
