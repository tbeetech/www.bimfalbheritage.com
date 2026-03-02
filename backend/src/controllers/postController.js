const store = require('../data/store');

const paginate = (items, page = 1, limit = 6) => {
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return {
    data,
    pagination: {
      total: items.length,
      page,
      pages: Math.ceil(items.length / limit) || 1,
      limit,
    },
  };
};

const getPosts = (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const posts = [...store.getAll()].sort(
      (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
    );
    res.json(paginate(posts, page, limit));
  } catch (err) {
    next(err);
  }
};

const getPost = (req, res, next) => {
  try {
    const post = store.getById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const createPost = (req, res, next) => {
  try {
    const coverImage = req.file ? `/uploads/${req.file.filename}` : req.body.coverImage || '';
    const sharePlatforms = req.body.sharePlatforms || '';
    const post = store.add({
      title: req.body.title,
      excerpt: req.body.excerpt || '',
      authorName: req.body.authorName || '',
      body: req.body.body,
      coverImage,
      videoUrl: req.body.videoUrl || '',
      category: req.body.category || 'Culture',
      collaborationPartner: req.body.collaborationPartner || '',
      collaborationType: req.body.collaborationType || '',
      sharePlatforms,
      publishDate: req.body.publishDate || new Date().toISOString(),
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const updatePost = (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates.coverImage = `/uploads/${req.file.filename}`;
    }
    const post = store.update(req.params.id, updates);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const deletePost = (req, res, next) => {
  try {
    const post = store.remove(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json({ message: 'Post removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
