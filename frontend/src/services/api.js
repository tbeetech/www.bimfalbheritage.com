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
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  const res = await api.post('/api/posts', formData);
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
