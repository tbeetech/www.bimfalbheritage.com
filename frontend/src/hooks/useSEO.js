import { useEffect, useMemo } from 'react';

const SITE_NAME = 'Bimfalb Heritage';
const SITE_URL = 'https://www.bimfalbheritage.org';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_DESCRIPTION =
  'Bimfalb Heritage (BIMFALB) preserves and promotes Nigerian cultural heritage, supports local artists, and documents historic traditions across Africa and the Globe.';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const TWITTER_HANDLE = '@bimfalbheritage';

const setOrRemoveAttribute = (element, attribute, value) => {
  if (value === null || value === undefined || value === '') {
    element.removeAttribute(attribute);
    return;
  }
  element.setAttribute(attribute, value);
};

const upsertMeta = (selector, identifyAttribute, identifyValue, content) => {
  let element = document.querySelector(selector);
  let created = false;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(identifyAttribute, identifyValue);
    document.head.appendChild(element);
    created = true;
  }

  const previous = element.getAttribute('content');
  element.setAttribute('content', content);

  return () => {
    if (created) {
      element.remove();
      return;
    }
    setOrRemoveAttribute(element, 'content', previous);
  };
};

const upsertMetaName = (name, content) => upsertMeta(`meta[name="${name}"]`, 'name', name, content);
const upsertMetaProperty = (property, content) => upsertMeta(`meta[property="${property}"]`, 'property', property, content);

const upsertLink = (rel, href) => {
  let element = document.querySelector(`link[rel="${rel}"]`);
  let created = false;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
    created = true;
  }

  const previous = element.getAttribute('href');
  element.setAttribute('href', href);

  return () => {
    if (created) {
      element.remove();
      return;
    }
    setOrRemoveAttribute(element, 'href', previous);
  };
};

const upsertJsonLd = (jsonLdText) => {
  const previous = document.querySelector('script[data-seo-jsonld]');
  if (previous) previous.remove();

  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.setAttribute('data-seo-jsonld', '1');
  script.textContent = jsonLdText;
  document.head.appendChild(script);

  return () => script.remove();
};

const toCanonicalUrl = (url) => {
  if (!url) {
    return `${window.location.origin}${window.location.pathname}`;
  }
  try {
    const parsed = new URL(url, SITE_URL);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  }
};

export function useSEO({
  title,
  description,
  image,
  url,
  type = 'website',
  robots = DEFAULT_ROBOTS,
  keywords,
  jsonLd,
  breadcrumbs,
} = {}) {
  const jsonLdText = useMemo(() => {
    if (!jsonLd && !breadcrumbs) return null;

    // If breadcrumbs are provided, wrap both schemas in a @graph
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };

      if (jsonLd) {
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [breadcrumbSchema, jsonLd],
        });
      }
      return JSON.stringify(breadcrumbSchema);
    }

    if (!jsonLd) return null;
    return JSON.stringify(jsonLd);
  }, [jsonLd, breadcrumbs]);

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Preserving Nigerian Cultural Identity`;
    const desc = description || DEFAULT_DESCRIPTION;
    const socialImage = image || DEFAULT_IMAGE;
    const canonical = toCanonicalUrl(url);

    const previousTitle = document.title;
    document.title = fullTitle;

    const cleanups = [
      upsertMetaName('description', desc),
      upsertMetaName('robots', robots),
      upsertMetaName('googlebot', robots),
      upsertMetaName('twitter:card', 'summary_large_image'),
      upsertMetaName('twitter:site', TWITTER_HANDLE),
      upsertMetaName('twitter:title', fullTitle),
      upsertMetaName('twitter:description', desc),
      upsertMetaName('twitter:image', socialImage),
      upsertMetaProperty('og:title', fullTitle),
      upsertMetaProperty('og:description', desc),
      upsertMetaProperty('og:image', socialImage),
      upsertMetaProperty('og:url', canonical),
      upsertMetaProperty('og:type', type),
      upsertMetaProperty('og:site_name', SITE_NAME),
      upsertMetaProperty('og:locale', 'en_NG'),
      upsertLink('canonical', canonical),
    ];

    if (keywords) {
      cleanups.push(upsertMetaName('keywords', keywords));
    }

    if (jsonLdText) {
      cleanups.push(upsertJsonLd(jsonLdText));
    }

    return () => {
      document.title = previousTitle;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [title, description, image, url, type, robots, keywords, jsonLdText]);
}
