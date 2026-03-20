/**
 * useSEO – lightweight hook to update document <head> SEO tags.
 *
 * Injects / updates:
 *   - <title>
 *   - <meta name="description">
 *   - <meta name="robots">
 *   - <link rel="canonical">
 *   - Open Graph tags  (og:title, og:description, og:image, og:url, og:type, og:site_name)
 *   - Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
 *   - JSON-LD <script type="application/ld+json"> (optional)
 *
 * All changes are reversed when the component unmounts so tags from a
 * previous page do not bleed into the next page.
 */

import { useEffect, useMemo } from 'react';

const SITE_NAME = 'Bimfalb Heritage';
const SITE_URL = 'https://www.bimfalbheritage.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;
const TWITTER_HANDLE = '@bimfalbheritage';

/**
 * Upsert a <meta> element.  Returns a cleanup function that restores the
 * previous content (or removes the tag if it was newly created).
 */
function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  let created = false;
  let prevContent = null;

  if (!el) {
    el = document.createElement('meta');
    // Set the identifying attribute (name or property)
    const [attrName, attrValue] = selector
      .replace(/\[|\]/g, '')
      .split('=')
      .map((s) => s.replace(/"/g, ''));
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
    created = true;
  } else {
    prevContent = el.getAttribute(attr);
  }
  el.setAttribute(attr, value);

  return () => {
    if (created) {
      el.remove();
    } else {
      el.setAttribute(attr, prevContent);
    }
  };
}

/**
 * Upsert a <link> element.  Returns cleanup.
 */
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  let created = false;
  let prevHref = null;

  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
    created = true;
  } else {
    prevHref = el.getAttribute('href');
  }
  el.setAttribute('href', href);

  return () => {
    if (created) {
      el.remove();
    } else {
      el.setAttribute('href', prevHref);
    }
  };
}

/**
 * Inject a JSON-LD <script> block.  Returns cleanup.
 */
function setJsonLd(data) {
  const existing = document.querySelector('script[data-seo-jsonld]');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-seo-jsonld', '1');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);

  return () => {
    script.remove();
  };
}

/**
 * @param {object} options
 * @param {string}  options.title        – Page title (appended with " | Bimfalb Heritage")
 * @param {string}  [options.description]
 * @param {string}  [options.image]      – Absolute URL to OG image
 * @param {string}  [options.url]        – Canonical URL (defaults to current href)
 * @param {string}  [options.type]       – OG type (default: "website")
 * @param {string}  [options.robots]     – robots meta content (default: "index, follow")
 * @param {object}  [options.jsonLd]     – JSON-LD structured data object
 */
export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  robots = 'index, follow',
  jsonLd,
} = {}) {
  // Stable serialised string so the effect only re-runs when the data changes
  const jsonLdStr = useMemo(
    () => (jsonLd ? JSON.stringify(jsonLd) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(jsonLd)]
  );

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc =
      description ||
      'Bimfalb Heritage preserves and promotes Nigerian cultural heritage, supports local artists, and documents historic traditions across Africa.';
    const img = image || DEFAULT_IMAGE;
    const canonical = url || window.location.href;

    const prevTitle = document.title;
    document.title = fullTitle;

    const cleanups = [
      setMeta('meta[name="description"]', 'content', desc),
      setMeta('meta[name="robots"]', 'content', robots),

      // Open Graph
      setMeta('meta[property="og:title"]', 'content', fullTitle),
      setMeta('meta[property="og:description"]', 'content', desc),
      setMeta('meta[property="og:image"]', 'content', img),
      setMeta('meta[property="og:url"]', 'content', canonical),
      setMeta('meta[property="og:type"]', 'content', type),
      setMeta('meta[property="og:site_name"]', 'content', SITE_NAME),

      // Twitter / X Card
      setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image'),
      setMeta('meta[name="twitter:site"]', 'content', TWITTER_HANDLE),
      setMeta('meta[name="twitter:title"]', 'content', fullTitle),
      setMeta('meta[name="twitter:description"]', 'content', desc),
      setMeta('meta[name="twitter:image"]', 'content', img),

      // Canonical
      setLink('canonical', canonical),
    ];

    if (jsonLdStr) cleanups.push(setJsonLd(JSON.parse(jsonLdStr)));

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, url, type, robots, jsonLdStr]);
}
