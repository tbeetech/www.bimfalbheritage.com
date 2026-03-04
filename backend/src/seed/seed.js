require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { db } = require('../config/firebase');
const { randomUUID } = require('crypto');
const posts = require('./data/posts');

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
  comments: Array.isArray(post.comments) ? post.comments : [],
  publishDate: post.publishDate instanceof Date
    ? post.publishDate.toISOString()
    : (post.publishDate || new Date().toISOString()),
});

const run = async () => {
  const batch = db.batch();
  const collection = db.collection('posts');

  posts.forEach((post) => {
    const normalized = normalizePost(post);
    const ref = collection.doc(normalized._id);
    batch.set(ref, normalized);
  });

  await batch.commit();
  console.log(`Seeded ${posts.length} posts to Firestore collection "posts".`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
