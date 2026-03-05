import axios from 'axios';
import fallbackPosts from '../data/fallbackPosts';

const baseURL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

const api = axios.create({ baseURL, withCredentials: true });

// Include stored admin password as x-admin-token header so token-based auth
// works as a fallback when the session cookie is unavailable (e.g. cross-origin).
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storedPassword = localStorage.getItem('bh_admin_password');
    if (storedPassword) {
      config.headers['x-admin-token'] = storedPassword;
    }
    // JWT for user auth (Bearer fallback when cookie not sent cross-origin)
    const token = localStorage.getItem('bh_user_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
  return res.data;
};

export const logout = async () => api.post('/api/auth/logout');

export const getSessionStatus = async () => {
  const res = await api.get('/api/auth/status');
  return res.data;
};

export const createPost = async (payload) => {
  const formData = new FormData();
  const { images, ...rest } = payload;
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (Array.isArray(images)) {
    images.forEach((img) => { if (img) formData.append('images', img); });
  }
  const res = await api.post('/api/posts', formData);
  return res.data;
};

export const updatePost = async (id, payload) => {
  const formData = new FormData();
  const { images, ...rest } = payload;
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (Array.isArray(images)) {
    images.forEach((img) => { if (img) formData.append('images', img); });
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
  if (res.data.token) localStorage.setItem('bh_user_token', res.data.token);
  return res.data;
};

export const userLogin = async (email, password) => {
  const res = await api.post('/api/users/login', { email, password });
  if (res.data.token) localStorage.setItem('bh_user_token', res.data.token);
  return res.data;
};

export const userLogout = async () => {
  await api.post('/api/users/logout');
  localStorage.removeItem('bh_user_token');
};

export const getUserMe = async () => {
  const token = localStorage.getItem('bh_user_token');
  if (!token) return null;
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
