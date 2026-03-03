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
    const contentType = req.query.contentType || '';

    let posts = [...store.getAll()].sort(
      (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
    );

    if (contentType) {
      posts = posts.filter((post) => post.contentType === contentType);
    }

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
    const uploadedImages = Array.isArray(req.files) && req.files.length > 0
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];
    const images = uploadedImages.length > 0 ? uploadedImages : (req.body.coverImage ? [req.body.coverImage] : []);
    const coverImage = images[0] || '';
    const post = store.add({
      title: req.body.title,
      excerpt: req.body.excerpt || '',
      authorName: req.body.authorName || '',
      body: req.body.body,
      coverImage,
      images,
      videoUrl: req.body.videoUrl || '',
      category: req.body.category || 'Culture',
      contentType: req.body.contentType || 'blog',
      collaborationPartner: req.body.collaborationPartner || '',
      collaborationType: req.body.collaborationType || '',
      sharePlatforms: req.body.sharePlatforms || '',
      tags: req.body.tags || '',
      eventMeta: {
        title: req.body.eventTitle || '',
        startDate: req.body.eventStartDate || '',
        endDate: req.body.eventEndDate || '',
        location: req.body.eventLocation || '',
        externalUrl: req.body.eventExternalUrl || '',
        platform: req.body.eventPlatform || 'Facebook Events',
      },
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
    if (Array.isArray(req.files) && req.files.length > 0) {
      const uploadedImages = req.files.map((f) => `/uploads/${f.filename}`);
      updates.images = uploadedImages;
      updates.coverImage = uploadedImages[0];
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

const reactToPost = (req, res, next) => {
  try {
    const type = req.body.type === 'down' ? 'down' : 'up';
    const reaction = store.reactToPost(req.params.id, type);
    if (!reaction) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(reaction);
  } catch (err) {
    next(err);
  }
};

const getComments = (req, res, next) => {
  try {
    const comments = store.getComments(req.params.id);
    if (!comments) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

const addComment = (req, res, next) => {
  try {
    if (!req.body.text || req.body.text.trim().length < 2) {
      res.status(400);
      throw new Error('Comment text is required');
    }
    const comment = store.addComment(req.params.id, {
      author: req.body.author,
      text: req.body.text.trim(),
      parentId: req.body.parentId || null,
    });
    if (!comment) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

const reactToComment = (req, res, next) => {
  try {
    const type = req.body.type === 'down' ? 'down' : 'up';
    const comment = store.reactToComment(req.params.id, req.params.commentId, type);
    if (!comment) {
      res.status(404);
      throw new Error('Post or comment not found');
    }
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  reactToPost,
  getComments,
  addComment,
  reactToComment,
};
