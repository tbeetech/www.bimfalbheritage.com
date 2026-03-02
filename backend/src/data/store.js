const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const seedPosts = require('../seed/data/posts');

const DATA_FILE = path.join(__dirname, 'posts.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedPosts, null, 2));
  }
};

const load = () => {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
};

let cache = load();

const persist = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2));
};

const getAll = () => cache;

const getById = (id) => cache.find((p) => p._id === id);

const add = (payload) => {
  const item = {
    _id: randomUUID(),
    publishDate: payload.publishDate || new Date().toISOString(),
    ...payload,
  };
  cache = [item, ...cache];
  persist();
  return item;
};

const update = (id, payload) => {
  const idx = cache.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  cache[idx] = { ...cache[idx], ...payload };
  persist();
  return cache[idx];
};

const remove = (id) => {
  const exists = getById(id);
  cache = cache.filter((p) => p._id !== id);
  persist();
  return exists;
};

module.exports = { getAll, getById, add, update, remove };
