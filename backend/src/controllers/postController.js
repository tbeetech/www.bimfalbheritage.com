const mongoose = require('mongoose');
const store = require('../data/store');
const GalleryItem = require('../models/Gallery');
const { bufferToDataUrl } = require('../utils/upload');

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

const getPosts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const contentType = req.query.contentType || '';

  // Fast-fail when DB is not ready — avoids the 10 s Mongoose buffer timeout
  if (mongoose.connection.readyState !== 1) {
    return res.json(paginate([], page, limit));
  }

  try {
    let posts = (await store.getAll()).sort(
      (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
    );

    if (contentType) {
      posts = posts.filter((post) => post.contentType === contentType);
    }

    res.json(paginate(posts, page, limit));
  } catch (err) {
    // Return empty results when the database is unavailable rather than a 500
    if (err instanceof mongoose.Error) {
      return res.json(paginate([], page, limit));
    }
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await store.getById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const parseSocialLinks = (body) => ({
  youtube: body.socialLinksYoutube || '',
  facebook: body.socialLinksFacebook || '',
  twitter: body.socialLinksTwitter || '',
  instagram: body.socialLinksInstagram || '',
  tiktok: body.socialLinksTiktok || '',
});

const parseEventMeta = (body) => ({
  title: body.eventTitle || '',
  startDate: body.eventStartDate || '',
  endDate: body.eventEndDate || '',
  location: body.eventLocation || '',
  externalUrl: body.eventExternalUrl || '',
  platform: body.eventPlatform || 'Facebook Events',
});

const createPost = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Service temporarily unavailable, please try again later' });
  }
  try {
    const uploadedImages = Array.isArray(req.files) && req.files.length > 0
      ? req.files.map((f) => bufferToDataUrl(f))
      : [];

    // Accept existing base64 data-URL images sent as text fields (preserves images
    // that were previously uploaded and are being re-submitted on edit/duplicate).
    const existingImages = req.body.existingImages
      ? (typeof req.body.existingImages === 'string' ? [req.body.existingImages] : req.body.existingImages)
      : [];

    const allImages = uploadedImages.length > 0
      ? uploadedImages
      : existingImages.length > 0
        ? existingImages
        : (req.body.coverImage ? [req.body.coverImage] : []);
    const coverImage = allImages[0] || '';

    const post = await store.add({
      title: req.body.title,
      excerpt: req.body.excerpt || '',
      authorName: req.body.authorName || '',
      body: req.body.body,
      coverImage,
      images: allImages,
      videoUrl: req.body.videoUrl || '',
      category: req.body.category || 'Culture',
      contentType: req.body.contentType || 'blog',
      collaborationPartner: req.body.collaborationPartner || '',
      collaborationType: req.body.collaborationType || '',
      sharePlatforms: req.body.sharePlatforms || '',
      socialLinks: parseSocialLinks(req.body),
      tags: req.body.tags || '',
      eventMeta: parseEventMeta(req.body),
      publishDate: req.body.publishDate || new Date().toISOString(),
    });

    // Also persist uploaded images to the gallery so they are accessible from the gallery view
    if (uploadedImages.length > 0) {
      const caption = req.body.title || 'Untitled Post';
      await Promise.all(
        uploadedImages.map((imageUrl) =>
          new GalleryItem({ imageUrl, caption }).save().catch((e) => {
            console.error('[postController] Failed to save image to gallery:', e.message);
          })
        )
      );
    }

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Service temporarily unavailable, please try again later' });
  }
  try {
    const updates = { ...req.body };
    let uploadedImages = [];

    if (Array.isArray(req.files) && req.files.length > 0) {
      // New images uploaded — replace existing
      uploadedImages = req.files.map((f) => bufferToDataUrl(f));
      updates.images = uploadedImages;
      updates.coverImage = uploadedImages[0];
    } else {
      // No new files — preserve existing images already in the database.
      // The frontend may send existing data-URL strings via `existingImages`
      // to explicitly keep them.  Otherwise, simply remove image keys from
      // the update payload so the $set does not overwrite stored values.
      const existingImages = req.body.existingImages
        ? (typeof req.body.existingImages === 'string' ? [req.body.existingImages] : req.body.existingImages)
        : null;

      if (existingImages && existingImages.length > 0) {
        updates.images = existingImages;
        updates.coverImage = existingImages[0];
      } else {
        delete updates.images;
        delete updates.coverImage;
      }
    }

    // Remove helper field so it does not persist on the document
    delete updates.existingImages;

    // Build socialLinks from flat form fields
    if (updates.socialLinksYoutube !== undefined || updates.socialLinksFacebook !== undefined ||
        updates.socialLinksTwitter !== undefined || updates.socialLinksInstagram !== undefined ||
        updates.socialLinksTiktok !== undefined) {
      updates.socialLinks = parseSocialLinks(updates);
    }
    // Clean up flat social-link fields
    delete updates.socialLinksYoutube;
    delete updates.socialLinksFacebook;
    delete updates.socialLinksTwitter;
    delete updates.socialLinksInstagram;
    delete updates.socialLinksTiktok;

    // Reconstruct eventMeta from flat fields when present
    if (updates.eventTitle !== undefined) {
      updates.eventMeta = parseEventMeta(updates);
    }
    // Clean up flat event fields
    delete updates.eventTitle;
    delete updates.eventStartDate;
    delete updates.eventEndDate;
    delete updates.eventLocation;
    delete updates.eventExternalUrl;
    delete updates.eventPlatform;

    const post = await store.update(req.params.id, updates);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Also persist newly uploaded images to the gallery
    if (uploadedImages.length > 0) {
      const caption = req.body.title || post.title || 'Untitled Post';
      await Promise.all(
        uploadedImages.map((imageUrl) =>
          new GalleryItem({ imageUrl, caption }).save().catch((e) => {
            console.error('[postController] Failed to save image to gallery:', e.message);
          })
        )
      );
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await store.remove(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json({ message: 'Post removed' });
  } catch (err) {
    next(err);
  }
};

const reactToPost = async (req, res, next) => {
  try {
    const type = req.body.type === 'down' ? 'down' : 'up';
    const reaction = await store.reactToPost(req.params.id, type);
    if (!reaction) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(reaction);
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await store.getComments(req.params.id);
    if (!comments) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    if (!req.body.text || req.body.text.trim().length < 2) {
      res.status(400);
      throw new Error('Comment text is required');
    }
    // Use authenticated user info if available
    const author = req.user ? req.user.name : (req.body.author || 'Guest');
    const userId = req.user ? req.user.id : null;
    const comment = await store.addComment(req.params.id, {
      author,
      userId,
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

const reactToComment = async (req, res, next) => {
  try {
    const type = req.body.type === 'down' ? 'down' : 'up';
    const comment = await store.reactToComment(req.params.id, req.params.commentId, type);
    if (!comment) {
      res.status(404);
      throw new Error('Post or comment not found');
    }
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

const incrementView = async (req, res, next) => {
  try {
    const result = await store.incrementView(req.params.id);
    if (!result) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required to like posts' });
    }
    const result = await store.toggleLike(req.params.id, userId);
    if (!result) {
      res.status(404);
      throw new Error('Post not found');
    }
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

const incrementShare = async (req, res, next) => {
  try {
    const result = await store.incrementShare(req.params.id);
    if (!result) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const deleteOwnComment = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const result = await store.deleteComment(req.params.id, req.params.commentId, userId);
    if (result === null) {
      res.status(404);
      throw new Error('Post or comment not found');
    }
    if (result === false) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    return res.json({ message: 'Comment deleted' });
  } catch (err) {
    return next(err);
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
  incrementView,
  toggleLike,
  incrementShare,
  deleteOwnComment,
};
