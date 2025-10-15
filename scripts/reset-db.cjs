/* eslint-env node */
// Simple reset script to clear local DB
const fs = require('fs');
const path = require('path');
const dbPath = path.join(process.cwd(), 'data', 'db.json');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
fs.writeFileSync(dbPath, JSON.stringify({ users: [], sessions: [], videos: [], likes: [] }, null, 2), 'utf-8');
console.log('Local DB reset: data/db.json');