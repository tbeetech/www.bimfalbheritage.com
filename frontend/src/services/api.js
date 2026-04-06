import axios from 'axios';
import fallbackPosts from '../data/fallbackPosts';

const DEFAULT_PROD_API_FALLBACK_ORIGIN = '';
const DEFAULT_PROD_HOSTNAMES = [
  'www.bimfalbheritage.org',
  'bimfalbheritage.org',
  'www.bimfalbheritage.com',
  'bimfalbheritage.com',
];

const PROD_API_FALLBACK_ORIGIN =
  import.meta.env.VITE_PROD_API_FALLBACK_ORIGIN?.trim() || DEFAULT_PROD_API_FALLBACK_ORIGIN;
const PREFER_SAME_ORIGIN_ON_PROD =
  import.meta.env.VITE_PREFER_SAME_ORIGIN_ON_PROD?.trim() !== 'false';

const configuredProdHostnamesRaw = import.meta.env.VITE_PROD_HOSTNAMES?.trim();
const configuredProdHostnames = configuredProdHostnamesRaw
  ? configuredProdHostnamesRaw.split(',').map((host) => host.trim()).filter(Boolean)
  : [];

const PROD_HOSTNAMES = new Set(
  configuredProdHostnames.length ? configuredProdHostnames : DEFAULT_PROD_HOSTNAMES
);

const resolveBaseURL = () => {
  const configured = import.meta.env.VITE_API_URL?.trim();
  if (typeof window === 'undefined') return configured || '';

  const isProductionHostname = PROD_HOSTNAMES.has(window.location.hostname);

  // The production site is served from Vercel and the API lives under the same
  // origin. Prefer same-origin there so a stale external VITE_API_URL does not
  // keep sending login/register requests to an old backend.
  if (isProductionHostname && PREFER_SAME_ORIGIN_ON_PROD) return window.location.origin;
  if (configured) return configured;
  if (isProductionHostname && PROD_API_FALLBACK_ORIGIN) return PROD_API_FALLBACK_ORIGIN;
  return window.location.origin;
};

const baseURL = resolveBaseURL();

const api = axios.create({ baseURL, withCredentials: true });

// Attach stored JWT as Bearer token so auth works even when cookies are unavailable
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bh_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const adminToken = localStorage.getItem('bh_admin_token');
    if (adminToken && !config.headers['x-admin-token']) {
      config.headers['x-admin-token'] = adminToken;
    }
  }
  return config;
});

export const getPosts = async (page = 1, limit = 6, contentType = '') => {
  try {
    const res = await api.get('/api/posts', { params: { page, limit, contentType } });
    return res.data;
  } catch (err) {
    console.warn('API unavailable, using fallback data', err?.message);
    const filtered = contentType ? fallbackPosts.filter((post) => post.contentType === contentType) : fallbackPosts;
    return { data: filtered, pagination: { total: filtered.length, pages: 1, page: 1, limit } };
  }
};

export const getPost = async (id) => {
  try {
    const res = await api.get(`/api/posts/${id}`);
    return res.data;
  } catch (err) {
    console.warn('Post fetch failed, using fallback', err?.message);
    return fallbackPosts.find((p) => p.id === id) || null;
  }
};

export const login = async (password) => {
  const res = await api.post('/api/auth/login', { password });
  if (res.data.token) {
    localStorage.setItem('bh_admin_token', res.data.token);
  }
  return res.data;
};

export const logout = async () => {
  await api.post('/api/auth/logout');
  localStorage.removeItem('bh_admin_token');
};

export const getSessionStatus = async () => {
  const res = await api.get('/api/auth/status');
  return res.data;
};

export const createPost = async (payload) => {
  const formData = new FormData();
  const { images, existingImages, ...rest } = payload;
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (Array.isArray(images)) {
    images.forEach((img) => { if (img) formData.append('images', img); });
  }
  // Send existing base64 data-URL strings so the backend can preserve them
  if (Array.isArray(existingImages)) {
    existingImages.forEach((img) => { if (img) formData.append('existingImages', img); });
  }
  const res = await api.post('/api/posts', formData);
  return res.data;
};

export const updatePost = async (id, payload) => {
  const formData = new FormData();
  const { images, existingImages, ...rest } = payload;
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (Array.isArray(images)) {
    images.forEach((img) => { if (img) formData.append('images', img); });
  }
  // Send existing base64 data-URL strings so the backend can preserve them
  if (Array.isArray(existingImages)) {
    existingImages.forEach((img) => { if (img) formData.append('existingImages', img); });
  }
  const res = await api.put(`/api/posts/${id}`, formData);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await api.delete(`/api/posts/${id}`);
  return res.data;
};

export const reactToPost = async (id, type = 'up') => {
  const res = await api.post(`/api/posts/${id}/reactions`, { type });
  return res.data;
};

export const getComments = async (id) => {
  try {
    const res = await api.get(`/api/posts/${id}/comments`);
    return res.data;
  } catch {
    return fallbackPosts.find((post) => post.id === id)?.comments || [];
  }
};

export const addComment = async (id, payload) => {
  const res = await api.post(`/api/posts/${id}/comments`, payload);
  return res.data;
};

export const reactToComment = async (id, commentId, type = 'up') => {
  const res = await api.post(`/api/posts/${id}/comments/${commentId}/reactions`, { type });
  return res.data;
};

export const deleteComment = async (postId, commentId) => {
  const res = await api.delete(`/api/posts/${postId}/comments/${commentId}`);
  return res.data;
};

// ── View / Like / Share ───────────────────────────────────────────────────────

export const trackView = async (id) => {
  try {
    const res = await api.post(`/api/posts/${id}/view`);
    return res.data;
  } catch {
    return null;
  }
};

export const likePost = async (id) => {
  const res = await api.post(`/api/posts/${id}/like`);
  return res.data;
};

export const sharePost = async (id) => {
  try {
    const res = await api.post(`/api/posts/${id}/share`);
    return res.data;
  } catch {
    return null;
  }
};

// ── User Auth ─────────────────────────────────────────────────────────────────

export const registerUser = async (name, email, password) => {
  const res = await api.post('/api/users/register', { name, email, password });
  return res.data;
};

export const userLogin = async (email, password) => {
  const res = await api.post('/api/users/login', { email, password });
  return res.data;
};

export const userLogout = async () => {
  await api.post('/api/users/logout');
};

export const getUserMe = async () => {
  const res = await api.get('/api/users/me');
  return res.data;
};

export const updateUserProfile = async (updates) => {
  const res = await api.put('/api/users/me', updates);
  return res.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.put('/api/users/me/password', { currentPassword, newPassword });
  return res.data;
};

// ── Gallery ───────────────────────────────────────────────────────────────────

export const getGalleryItems = async () => {
  const res = await api.get('/api/gallery');
  return res.data;
};

export const createGalleryItem = async (payload) => {
  const formData = new FormData();
  const images = Array.isArray(payload.images) ? payload.images : (payload.image ? [payload.image] : []);
  images.forEach((img) => formData.append('images', img));
  if (payload.caption !== undefined) formData.append('caption', payload.caption);
  const res = await api.post('/api/gallery', formData);
  return res.data;
};

export const deleteGalleryItem = async (id) => {
  const res = await api.delete(`/api/gallery/${id}`);
  return res.data;
};
