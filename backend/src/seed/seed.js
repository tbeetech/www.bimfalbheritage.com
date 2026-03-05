require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Post = require('../models/Post');
const posts = require('./data/posts');

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Seed failed: MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('[db] Connected to MongoDB Atlas');

  // Clear existing posts and insert seed data
  await Post.deleteMany({});
  await Post.insertMany(
    posts.map((post) => ({
      _id: post._id,
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
    }))
  );

  console.log(`Seeded ${posts.length} posts to MongoDB collection "posts".`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
