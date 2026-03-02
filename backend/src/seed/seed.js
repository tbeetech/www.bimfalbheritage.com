const fs = require('fs');
const path = require('path');
const posts = require('./data/posts');

const DATA_FILE = path.join(__dirname, '..', 'data', 'posts.json');

const run = () => {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  console.log(`Seeded ${posts.length} posts to ${DATA_FILE}`);
};

run();
