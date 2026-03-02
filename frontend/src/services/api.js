import axios from 'axios';
import fallbackPosts from '../data/fallbackPosts';

const baseURL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

const api = axios.create({ baseURL, withCredentials: true });

export const getPosts = async (page = 1, limit = 6) => {
  try {
    const res = await api.get('/api/posts', { params: { page, limit } });
    return res.data;
  } catch (err) {
    console.warn('API unavailable, using fallback data', err?.message);
    return { data: fallbackPosts, pagination: { total: fallbackPosts.length, pages: 1, page: 1, limit } };
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
