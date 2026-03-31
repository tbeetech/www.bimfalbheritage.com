/**
 * Resolves an image URL for use in <img src="…"> tags.
 *
 * Handles three cases:
 *  - data: URLs (base64-encoded images stored in MongoDB) — returned as-is
 *  - Absolute http/https URLs — returned as-is
 *  - Relative paths — prefixed with VITE_API_URL (for locally-served images)
 */
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (/bimfalbheritage\.com\/wp-content\/uploads\//i.test(url)) return '/logo.jpg';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${import.meta.env.VITE_API_URL || ''}${url}`;
};
