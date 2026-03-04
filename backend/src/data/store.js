const path = require('path');
const fs = require('fs');
const { db, firebaseAvailable } = require('../config/firebase');
const { randomUUID } = require('crypto');

// ---------------------------------------------------------------------------
// Local JSON file fallback (used when Firebase credentials are not available)
// ---------------------------------------------------------------------------
const LOCAL_FILE = path.join(__dirname, 'posts.json');

const readLocal = async () => {
  try {
    const raw = await fs.promises.readFile(LOCAL_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeLocal = async (posts) => {
  await fs.promises.writeFile(LOCAL_FILE, JSON.stringify(posts, null, 2), 'utf8');
};

// ---------------------------------------------------------------------------
// Firestore collection name
// ---------------------------------------------------------------------------
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
  if (!firebaseAvailable) {
    return readLocal();
  }
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map(docToPost);
};

const getById = async (id) => {
  if (!firebaseAvailable) {
    const posts = await readLocal();
    return posts.find((p) => p._id === id) || null;
  }
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
  if (!firebaseAvailable) {
    const posts = await readLocal();
    posts.unshift(item);
    await writeLocal(posts);
    return item;
  }
  await db.collection(COLLECTION).doc(id).set(item);
  return item;
};

const update = async (id, payload) => {
  if (!firebaseAvailable) {
    const posts = await readLocal();
    const idx = posts.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    const updated = normalizePost({ ...posts[idx], _id: id, ...payload });
    posts[idx] = updated;
    await writeLocal(posts);
    return updated;
  }
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const updated = normalizePost({ ...doc.data(), _id: id, ...payload });
  await ref.set(updated);
  return updated;
};

const remove = async (id) => {
  if (!firebaseAvailable) {
    const posts = await readLocal();
    const idx = posts.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    const [item] = posts.splice(idx, 1);
    await writeLocal(posts);
    return item;
  }
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const item = docToPost(doc);
  await ref.delete();
  return item;
};

const reactToPost = async (id, type) => {
  if (!firebaseAvailable) {
    const posts = await readLocal();
    const idx = posts.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    if (type === 'up') posts[idx].upvotes = Number(posts[idx].upvotes || 0) + 1;
    if (type === 'down') posts[idx].downvotes = Number(posts[idx].downvotes || 0) + 1;
    await writeLocal(posts);
    const { upvotes, downvotes } = posts[idx];
    return { upvotes, downvotes, score: upvotes - downvotes };
  }
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
  if (!firebaseAvailable) {
    const posts = await readLocal();
    const post = posts.find((p) => p._id === id);
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
  }
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
  const comment = {
    id: randomUUID(),
    parentId: payload.parentId || null,
    author: payload.author || 'Guest',
    text: payload.text || '',
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };
  if (!firebaseAvailable) {
    const posts = await readLocal();
    const idx = posts.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    if (!Array.isArray(posts[idx].comments)) posts[idx].comments = [];
    posts[idx].comments.push(comment);
    await writeLocal(posts);
    return comment;
  }
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const comments = Array.isArray(doc.data().comments) ? doc.data().comments : [];
  comments.push(comment);
  await ref.update({ comments });
  return comment;
};

const reactToComment = async (postId, commentId, type) => {
  if (!firebaseAvailable) {
    const posts = await readLocal();
    const pIdx = posts.findIndex((p) => p._id === postId);
    if (pIdx === -1) return null;
    const comments = Array.isArray(posts[pIdx].comments) ? posts[pIdx].comments : [];
    const cIdx = comments.findIndex((c) => c.id === commentId);
    if (cIdx === -1) return null;
    if (type === 'up') comments[cIdx].upvotes = Number(comments[cIdx].upvotes || 0) + 1;
    if (type === 'down') comments[cIdx].downvotes = Number(comments[cIdx].downvotes || 0) + 1;
    posts[pIdx].comments = comments;
    await writeLocal(posts);
    return comments[cIdx];
  }
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
