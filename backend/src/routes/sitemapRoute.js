const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const router = express.Router();

/** Generous limiter for the public sitemap endpoint: 30 per 15 minutes per IP */
const sitemapLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down' },
});

const SITE_URL = 'https://www.bimfalbheritage.com';

const staticPages = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog', changefreq: 'daily', priority: '0.9' },
  { loc: '/events', changefreq: 'weekly', priority: '0.8' },
  { loc: '/gallery', changefreq: 'weekly', priority: '0.7' },
  { loc: '/donations', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.6' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.5' },
];

router.get('/sitemap.xml', sitemapLimiter, async (req, res) => {
  let postEntries = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const posts = await Post.find({}, { _id: 1, publishDate: 1, updatedAt: 1 }).lean();
      postEntries = posts.map((p) => {
        const lastmod = p.updatedAt
          ? new Date(p.updatedAt).toISOString().split('T')[0]
          : p.publishDate
          ? new Date(p.publishDate).toISOString().split('T')[0]
          : undefined;
        return { loc: `/blog/${p._id}`, changefreq: 'monthly', priority: '0.6', lastmod };
      });
    } catch {
      // fall through — return static-only sitemap
    }
  }

  const urlEntries = [...staticPages, ...postEntries]
    .map(({ loc, changefreq, priority, lastmod }) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
      return `  <url>
    <loc>${SITE_URL}${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

module.exports = router;
